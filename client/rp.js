var rp = opt => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        xhr.open(opt.method || 'GET', opt.uri)
        if(opt.headers) Object.keys(opt.headers).forEach(key => xhr.setRequestHeader(key, opt.headers[key]));
        if(!opt.headers['Content-Type']) xhr.setRequestHeader('Content-Type', 'application/json')
        if(opt.body && typeof opt.body == 'object') opt.body = JSON.stringify(opt.body)
        xhr.addEventListener('load', e => {
            if (this.status >= 200 && this.status < 300) {
                if(opt.json) resolve(JSON.parse(xhr.response));
                else resolve()
            } else {
                reject({
                  status: this.status,
                  statusText: xhr.statusText
                });
            }
        })
    })
}