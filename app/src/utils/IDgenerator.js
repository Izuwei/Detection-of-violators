/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

var lastID = 0;

/**
 * Source: https://stackoverflow.com/questions/29420835/how-to-generate-unique-ids-for-form-labels-in-react
 * Author: Artem Sapegin
 * Date: 6.4.2015
 */
const generator = () => {
  lastID++;
  return lastID;
};

export default generator;
