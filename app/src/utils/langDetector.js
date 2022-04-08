/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

/**
 * Function gets value of the specified cookie.
 *
 * @param {String} name Name of the cookie.
 * @returns Value of the cookie.
 */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

/**
 * Detection of last used language stored in cookie, if cookie does not exits,
 * then value 'undefined' is returned, but i18n handles issue a sets default
 * language in i18n.js.
 */
const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    const lang = getCookie("lang");
    return callback(lang);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

export default languageDetector;
