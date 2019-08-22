import React from "react";
import classNames from "classnames";
import TextField from "../formControls/text-field/TextField";
import ToggleSwitch from "../formControls/toggle-switch/ToggleSwitch";
import Button, { ButtonSize } from "../button/Button";
import Confirmation from "../confirmation/Confirmation";
import {
  setName,
  setExchange,
  setSymbol,
  setVisible,
  setEnabled
} from "../../actions/inputFormActions";
import { InputFormState } from "../../enums";
import "./FormBody.css";
import PropTypes from "prop-types";

const FormBody = ({
  state,
  dispatch,
  securityId,
  submitForm,
  deleteSecurity
}) => {
  return (
    <form className="input-form-body" onSubmit={submitForm}>
      <div className="input-row">
        <label className="input-label" htmlFor="exchange-input">
          Exchange
        </label>
        <TextField
          id="exchange-input"
          value={state.security.exchange}
          readOnly={!!securityId}
          onChange={event => dispatch(setExchange(event.target.value))}
        />
      </div>
      <div className="input-row">
        <label className="input-label" htmlFor="symbol-input">
          Symbol
        </label>
        <TextField
          id="symbol-input"
          value={state.security.symbol}
          readOnly={!!securityId}
          onChange={event => dispatch(setSymbol(event.target.value))}
        />
      </div>
      <div className="input-row">
        <label className="input-label" htmlFor="name-input">
          Name
        </label>
        <TextField
          id="name-input"
          value={state.security.name}
          onChange={event => dispatch(setName(event.target.value))}
        />
      </div>
      <div className="input-row">
        <label className="input-label" htmlFor="visible-toggle">
          Visible
        </label>
        <ToggleSwitch
          id="visible-toggle"
          checked={state.security.visible}
          onChange={event => dispatch(setVisible(event.target.checked))}
        />
      </div>
      <div className="input-row">
        <label className="input-label" htmlFor="enabled-toggle">
          Enabled
        </label>
        <ToggleSwitch
          id="enabled-toggle"
          checked={state.security.enabled}
          onChange={event => dispatch(setEnabled(event.target.checked))}
        />
      </div>
      <div className="input-buttons-container">
        <Button
          size={ButtonSize.LARGE}
          className={classNames("input-submit-button", {
            "in-progress": state.fetchStatus === InputFormState.SENDING
          })}
        >
          {securityId ? "Save" : "Create"}
        </Button>
        {securityId && (
          <Confirmation confirmationText="Are you sure you want to delete this security?">
            <Button
              type="button"
              className="input-delete-button"
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
