const FormData = require('form-data');
const axios = require('axios');
const Busboy = require("busboy");

const parseFormData = (event) => {
    return new Promise((resolve, reject) => {
        const busboy = new Busboy({
            headers: {
                ...event.headers,
                "content-type":
                    event.headers["Content-Type"] || event.headers["content-type"],
            },
        });
        const result = {
            files: [],
        };

        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            file.on("data", (data) => {
                result.files.push({
                    fieldname: fieldname,
                    encoding: encoding,
                    file: data,
                    fileName: filename,
                    contentType: mimetype,
                });
            });
        });
        busboy.on("field", (fieldname, value) => {
            try {
                result[fieldname] = JSON.parse(value);
            } catch (err) {
                result[fieldname] = value;
            }
        });
        busboy.on("error", (error) => reject(`Parse error: ${error}`));
        busboy.on("finish", () => {
            event.body = result;
            resolve(event);
        });
        busboy.write(event.body, event.isBase64Encoded ? "base64" : "binary");
        busboy.end();
    });
};


module.exports = async function (context, req) {
    try {
        await parseFormData(req);
        var form = new FormData();

        for (var i = 0; i < req.body.files.length; ++i) {
            var file = req.body.files[i];
            form.append(file.fieldname, file.file, file.fileName);
        }
        delete req.body.files;

        Object.keys(req.body).forEach((key, index) => {
            var val = req.body[key];
            form.append(key, val.toString());
        })

        try {
            var options = {
                method: 'post',
                url: 'https://api.remove.bg/v1.0/removebg',
                headers: {
                    'accept': 'image/*',
                    'X-API-Key': process.env.REMOVE_BG_API_KEY,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...form.getHeaders()
                },
                data: form,
                responseType: "arraybuffer"
            };

            var axiosResponse = await axios(options);

            context.res = {
                status: axiosResponse.status,
                headers: {
                    'content-type': axiosResponse.headers['content-type']
                },
                body: axiosResponse.data
            };
            //res.status(axiosResponse.status).set('content-type', axiosResponse.headers['content-type']).send(axiosResponse.data);
        } catch (error) {
            var errorResponse = { title: error.message };
            if (error.response && error.response.data) {
                var errorResponse = JSON.parse(error.response.data);
                if (errorResponse.errors && errorResponse.errors[0]) {
                    errorResponse = errorResponse.errors[0];
                }
            }

            context.res = {
                status: 500,
                body: errorResponse
            };
        }
    } catch (error) {
        context.res = {
            status: 500,
            body: { title: error.message }
        };
    }
}