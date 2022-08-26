import ResourceManagerXHR from "./web4dvResource.js";

/**
 * Metadata Class
 * @params url:string;
 * @params json:boolean;
 * @params cb:function
 */
export default class MetaData {
    constructor(url, json, cb) {
        this.url = url

        return this.getMeta(json, cb)
    }

    getMeta(json, cb) {
        const resource = new ResourceManagerXHR()
        resource.set4DSFile(this.url)

        resource.Open(() => {
            const info = resource._sequenceInfo

            // data components
            const frameRate = Math.ceil(info.FrameRate)
            const totalFrame = info.NbFrames
            // pointerToTrackIndex: 오디오 포함 파일의 사이즈
            // pointerToBlocIndex: 오디오 미포함 파일의 사이즈
            const size = resource._pointerToTrackIndex !== 0 ? resource._pointerToTrackIndex : resource._pointerToBlocIndex

            // time data components
            const sec = Math.floor(totalFrame / frameRate)
            const frame = Math.floor(totalFrame % frameRate)

            const showSecFormat = sec >= 10 ? sec : `0${sec}`
            const showFrameFormat = frame >= 10 ? frame : `0${frame}`

            // set json
            const metaJSON = new Object()
            metaJSON.fileName = resource._file4ds.substring(resource._file4ds.lastIndexOf('/')+1)
            metaJSON.fileFormat = resource._file4ds.substring(resource._file4ds.lastIndexOf('.')+1)
            metaJSON.fileSize = `${size} bytes`
            metaJSON.totalFrames = totalFrame
            metaJSON.framerate = frameRate
            metaJSON.totalLength = `${showSecFormat}:${showFrameFormat}`

            // change format if json value is 'true'
            const toJSON = JSON.stringify(metaJSON, null, "\t")

            // output
            json ? cb(toJSON) : cb(metaJSON)
        })
    }
}
