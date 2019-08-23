import React, { useEffect, useReducer } from "react";
import Components from "stockflux-components";
import { Link, Redirect } from "react-router-dom";
import "./InputForm.css";
import * as service from "../../services/SecuritiesService";
import ValidationError from "../../services/ValidationError";
import Alert, { AlertType } from "../alert/Alert";
import { FetchState } from "../../enums";
import { inputFormReducer } from "../../reducers/inputFormReducer";
import PropTypes from "prop-types";
import {
  formLoading,
  formSending,
  formError,
  formSuccess,
  setName,
  setExchange,
  setSymbol,
  setVisible,
  setEnabled,
  setRedirect
} from "../../actions/inputFormActions";
import { FaArrowLeft } from "react-icons/fa";
import FormBody from "./FormBody";

const InputForm = ({ match }) => {
  const initialFormState = {
    fetchStatus: match.params.securityId
      ? FetchState.LOADING
      : FetchState.COMPLETED,
    hasErrors: false,
    messages: [],
    security: {
      name: "",
      exchange: "",
      symbol: "",
      visible: false,
      enabled: false
    },
    redirect: false
  };

  const [state, dispatch] = useReducer(inputFormReducer, initialFormState);

  const setSecurityState = security => {
    dispatch(setName(security.name));
    dispatch(setExchange(security.exchange));
    dispatch(setSymbol(security.symbol));
    dispatch(setVisible(security.visible));
    dispatch(setEnabled(security.enabled));
  };

  useEffect(() => {
    if (match.params.securityId) {
      dispatch(formLoading());
      service
        .getSecurity(match.params.securityId)
        .then(security => {
          dispatch(formSuccess([]));
          setSecurityState(security);
        })
        .catch(() => {
          dispatch(formError(["Error, cannot get security"]));
        });
    }
  }, [match.params.securityId]);

  const handleError = err => {
    const message =
      err instanceof ValidationError ? err.messages : [err.message];
    dispatch(formError(message));
  };

  const submitForm = event => {
    event.preventDefault();
    dispatch(formSending());

    if (match.params.securityId) {
      service
        .updateSecurity(match.params.securityId, state.security)
        .then(() => {
          dispatch(formSuccess(["Security was successfully updated"]));
        })
        .catch(handleError);
    } else {
      service
        .postSecurity(state.security)
        .then(() => {
          dispatch(formSuccess(["Security was successfully created"]));
          setSecurityState({
            exchange: "",
            symbol: "",
            name: "",
            visible: false,
            enabled: false
          });
        })
        .catch(handleError);
    }
  };

  const deleteSecurity = () => {
    service
      .deleteSecurity(match.params.securityId)
      .then(() => {
        dispatch(formSuccess(["Security was successfully deleted"]));
        dispatch(setRedirect(true));
      })
      .catch(handleError);
  };

  if (state.redirect) {
    return (
      <Redirect
        push
        to={{
          pathname: "/",
          state: { messages: state.messages }
        }}
      />
    );
  }
  return (
    <div className="input-form-container">
      <h1 className="input-form-title">
        {match.params.securityId ? "Edit Security" : "Create a Security"}
      </h1>
      {state.fetchStatus === FetchState.LOADING ? (
        <div className="input-form-spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : (
        <FormBody
          state={state}
          dispatch={dispatch}
          securityId={match.params.securityId}
          submitForm={submitForm}
          deleteSecurity={deleteSecurity}
        />
      )}
      {state.messages.length > 0 && (
        <Alert
          type={state.hasErrors ? AlertType.ERROR : AlertType.SUCCESS}
          messages={state.messages}
        />
      )}
      <Link to="/">
        <div className="back-button">
          <button>
            <FaArrowLeft size={20} />
          </button>
        </div>
      </Link>
    </div>
  );
};

InputForm.propTypes = {
  match: PropTypes.object.isRequired
};

export default InputForm;
