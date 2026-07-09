// checks the body depending on which mode we're in:
// create (POST)  -> title + course required, completed optional (defaults false)
// replace (PUT)  -> title, course, completed ALL required
// patch (PATCH)  -> any subset can be sent, but at least one field is needed
//                    and whatever is sent has to have the right type
function validateTask(mode) {
  return (req, res, next) => {
    const body = req.body || {};
    const { title, course, completed } = body;
    const errors = [];

    const requireAll = mode === 'create' || mode === 'replace';

    if (mode === 'patch' && title === undefined && course === undefined && completed === undefined) {
      errors.push('at least one of title, course, completed must be provided');
    }

    if (requireAll || title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        errors.push('title is required and must be a non-empty string');
      }
    }

    if (requireAll || course !== undefined) {
      if (typeof course !== 'string' || course.trim() === '') {
        errors.push('course is required and must be a non-empty string');
      }
    }

    if (mode === 'replace' || completed !== undefined) {
      if (typeof completed !== 'boolean') {
        errors.push('completed must be a boolean');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    next();
  };
}

module.exports = validateTask;