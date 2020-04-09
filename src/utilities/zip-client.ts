var jsZip = require('jszip')

export function unzip (file: string, callback: object) {
    const files: {
       name: string;
       file: File;
       filePath: string;
    }[] = []
    return new Promise((resolve, reject) => {
        // TODO: refactor this method
        jsZip.loadAsync(file).then(function (zip: any) {
            Object.keys(zip.files).forEach(function (filename, index) {
                zip.files[filename].async('blob').then(function (fileData: any) {
                    files.push({
                        name: filename,
                        file: new File([fileData], filename),
                        filePath: window.URL.createObjectURL(fileData)
                    })
                    if (index === Object.keys(zip.files).length - 1) {
                        resolve(files)
                    }
                })
            })
        })
    })
}
