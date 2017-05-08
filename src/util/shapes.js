import PropTypes from 'prop-types';

const USER_SHAPE = PropTypes.shape({
  token: PropTypes.string.isRequired,
  profile: PropTypes.object.isRequired
});

export {
  USER_SHAPE
};