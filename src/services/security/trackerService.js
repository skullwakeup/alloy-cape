export function logDownload(doc){

    doc.downloadCount++;

    doc.activityLog.push({

        type:"DOWNLOAD",

        time:new Date().toISOString()

    });

}

export function logInternalShare(doc){

    doc.shareCount++;

    doc.internalShares++;

    doc.activityLog.push({

        type:"INTERNAL_SHARE",

        time:new Date().toISOString()

    });

}

export function logExternalShare(doc,email){

    doc.shareCount++;

    doc.externalShares++;

    doc.activityLog.push({

        type:"EXTERNAL_SHARE",

        target:email,

        time:new Date().toISOString()

    });

}