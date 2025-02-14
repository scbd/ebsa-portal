
export default[
   
    {
        "code": "ar",
        "name": "Arabic",
        "nativeName": "العربية",
        "dir": 'rtl'
    },
    {
        "code": "en",
        "name": "English",
        "nativeName": "English"
    },
    {
        "code": "es",
        "name": "Spanish",
        "nativeName": "Español"
    },
    {
        "code": "fr",
        "name": "French",
        "nativeName": "Français"
    },
    {
        "code": "ru",
        "name": "Russian",
        "nativeName": "Русский"
    },
    {
        "code": "zh",
        "name": "Chinese, Simplified",
        "nativeName": "简体中文"
    }
].map((l)=> {
    const { code, name, nativeName } = l;
    const rtlLangs = [ "am","ar","az", "he", "fa", "ur", 'mv', 'ku' ];
    const file = `locales/${code}.json`;

    return { nativeName, file, name, code,  language:code, dir: rtlLangs.includes(code)? 'rtl' : 'ltr'}
})
