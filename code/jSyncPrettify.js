/**
 * JSync Prettify is a css prettifier!
 * This provides special shortcuts that might help you!
 * @param jSyncTags
 */
const $sPrettify = {
    render: (domData) => {
        let parser = new DOMParser();
        
        let prettified = parser.parseFromString(domData,"text/xml");
        prettified.getElementsByTagName("group").length
    }
}