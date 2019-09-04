import React from 'react';
import classNames from 'classnames';
import Button, { ButtonSize } from '../button/Button';
import Confirmation from '../confirmation/Confirmation';
import {
  setName,
  setExchange,
  setSymbol,
  setEnabled
} from '../../actions/inputForm';
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
        label="Exchange"
        id="exchange-input"
        value={state.security.exchange}
        readOnly={!!securityId}
        onChange={event => dispatch(setExchange(event.target.value))}
        type={RowType.TEXT}
      />
      <FormRow
        label="Symbol"
        id="symbol-input"
        value={state.security.symbol}
        readOnly={!!securityId}
        onChange={event => dispatch(setSymbol(event.target.value))}
        type={RowType.TEXT}
      />
      <FormRow
        label="Name"
        id="name-input"
        value={state.security.name}
        onChange={event => dispatch(setName(event.target.value))}
        type={RowType.TEXT}
      />
      <FormRow
        label="Enabled"
        id="enabled-toggle"
        checked={state.security.enabled}
        onChange={event => dispatch(setEnabled(event.target.checked))}
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
