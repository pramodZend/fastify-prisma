const COM_METHODS = require('../../common/methods');
const fs = require('fs');
const ERR_MSG = require('../../common/error_messages');
const CONSTANT = require('../../common/constant');
const Logger = require('../../handlers/winston');
const logger = new Logger('controller/file/upload_file');

/*                        
    Move the upload file to Web Server - Start
*/
var sshSftpClient = require('ssh2-sftp-client');

var DOC_SFTP = process.env.DOC_SFTP;
if(DOC_SFTP)
{
    var sshSftpClientInstance = new sshSftpClient();


    if(sshSftpClientInstance)
    {
        sshSftpClientInstance.connect({
            host: process.env.DOC_SFTPHOST,
            port: process.env.DOC_SFTPPORT,
            username: process.env.DOC_SFTPUSER,
            password: process.env.DOC_SFTPPWD
        }).then(() => {
            console.log('sftp connection made with PHP server');
            logger.info('sftp connection made with PHP server');  
        }).then((data) => {
            console.log(data, 'the data info');
            logger.info('the data info', data);  
        }).catch((err) => {
            console.error(err, 'catch error:sftp connection failed');
            logger.error("catch error:sftp connection failed", err);  
        });
    }
    else
    {
        console.error(err, 'catch error:sftp connection failed-2');
        logger.error("catch error:sftp connection failed-2");  
    }
}
/*                        
    Move the upload file to Web Server - End
*/

exports.upload_file = async (ur_id, files, callback)=>{
    if(files && files.file && files.file.path){
        fs.readFile(files.file.path, (err, data) => {
            if(err){
                callback(err);
                return
            }
            let mimeType = files.file.type;
            let fileSizeInMegaBytes = (files.file.size)/(1024*1024);
            fileSizeInMegaBytes = fileSizeInMegaBytes.toFixed(4);
            let fileExtension = files.file.name.split('.').pop(-1);
            if (!COM_METHODS.checkMimeType(mimeType, fileExtension)) {
                callback(ERR_MSG.INVALID_FILE_TYPE);
                return;
            }
            let baseFolder = CONSTANT.DOC.DOC_PATH;
            let remoteBaseFolder = process.env.DOC_REMOTE_BASEPATH;

            if (!fs.existsSync(baseFolder)){
                fs.mkdirSync(baseFolder);
            }
            let basePath = '/'+ur_id+'/';
            baseFolder += basePath;
            remoteBaseFolder += basePath;

            if (!fs.existsSync(baseFolder)){
                fs.mkdirSync(baseFolder);
            }

            let relativeFilepath = (new Date()).getTime()+files.file.name;
            fs.writeFile(baseFolder + relativeFilepath, data , function(err) {
                if(err){
                    callback(err);
                }
                else if(!err){
                    /*                        
                        Move the upload file to Web Server - Start
                    */
                    if(DOC_SFTP && sshSftpClientInstance) {
                        setTimeout(function(){

                            sshSftpClientInstance.exists(remoteBaseFolder)
                            .then(st => {
                                if(!st) {
                                    sshSftpClientInstance.mkdir(remoteBaseFolder, true)
                                    .then(() => {
                                        return sshSftpClientInstance.chmod(remoteBaseFolder, '777');
                                    })
                                    .then(st => {
                                        sshSftpClientInstance.put(baseFolder + relativeFilepath , remoteBaseFolder + relativeFilepath)
                                        .then(st => {
                                            
                                        }, err => {
                                             
                                        });
                                    }, err => {
                                        console.log("=================errr",err);
                                    });
                                }
                                else {
                                   
                                    sshSftpClientInstance.put(baseFolder + relativeFilepath , remoteBaseFolder + relativeFilepath)
                                    .then(st => {
                                    }, err => {
                                       
                                    });
                                }
                            }, err => {
                            });
                        },process.env.DOC_SETTIMEOUT);
                    }
                    let docDetails = {
                        ukyc_upload_filename:relativeFilepath,
                        ukyc_file_relative_path: basePath,
                        ukyc_file_extension:fileExtension,
                        ukyc_file_type:mimeType,
                        ukyc_file_size_mega_bytes:fileSizeInMegaBytes
                    };
                    callback(null,docDetails);
                }
            });
        });
    }
    else
        callback(ERR_MSG.INVALID_FILE_TYPE);
}

/*
checkMimeType(mimeType,originalname){
    let isAllow;
    let mimetype = mimeType;
		let allowedMimeType = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
		let extension 	=	['jpg','jpeg','png','pdf','doc','docx','JPG','JPEG','PNG','PDF','DOC','DOCX']
		if (mimetype){
			let fileExtension = originalname.split('.').pop(-1);
			console.log(fileExtension);
			console.log(mimetype);
			if (extension.includes(fileExtension)) {
				isAllow = allowedMimeType.includes(mimetype)
			} else { isAllow = false; }
			return isAllow ;
		} else return true;
	}
};
*/