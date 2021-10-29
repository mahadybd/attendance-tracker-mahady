exports.InvalidIdException = function () {
 this.status = 400;
 this.message = 'Invalid user ID';
};

exports.UserNotFoundException = function () {
 this.status = 404;
 this.message = 'Wrong password!';
};
