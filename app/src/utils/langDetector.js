const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    const lang = "en";
    return callback(lang);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

export default languageDetector;
