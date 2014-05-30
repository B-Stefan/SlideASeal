/**
 * Creates an instance of Action.
 *
 * @constructor
 * @param {string} inType - The name of the action type
 * @param {string} inData - The object for the action type.
 * @this {Action}
 * @returns {this}
 */
exports.Action = function (inType, inData) {

    /** @access public */
    this.type     = inType;
    this.data     = inData;

    return this;
}