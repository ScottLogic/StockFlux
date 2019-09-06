import React from 'react';
import classNames from 'classnames';
import Button, { ButtonSize } from '../button/Button';
import Confirmation from '../confirmation/Confirmation';
import { setName, setDisabled } from '../../actions/inputForm';
import { FetchState } from '../../enums';
import './FormBody.css';
import PropTypes from 'prop-types';
import FormRow, { RowType } from './FormRow';

const FormBody = ({
  state,
  dispatch,
  securityId,
  submitForm,
  deleteSecurity
}) => {
  return (
    <form onSubmit={submitForm}>
      <FormRow
        label="Name"
        id="name-input"
        value={state.security.name}
        onChange={event => dispatch(setName(event.target.value))}
        type={RowType.TEXT}
      />
      <FormRow
        label="Disabled"
        id="disabled-toggle"
        checked={state.security.disabled}
        onChange={event => dispatch(setDisabled(event.target.checked))}
        type={RowType.TOGGLE}
      />
      <div className="input-buttons-container">
        <Button
          size={ButtonSize.LARGE}
          className={classNames('submit', {
            'in-progress': state.fetchStatus === FetchState.UPDATING
          })}
        >
          {securityId ? 'Save' : 'Create'}
        </Button>
        {securityId && (
          <Confirmation confirmationText="Are you sure you want to delete this security?">
            <Button
              type="button"
              className="delete"
              size={ButtonSize.LARGE}
              onClick={deleteSecurity}
            >
              Delete
            </Button>
          </Confirmation>
        )}
      </div>
    </form>
  );
};

FormBody.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  securityId: PropTypes.string,
  submitForm: PropTypes.func.isRequired,
  deleteSecurity: PropTypes.func.isRequired
};

export default FormBody;
