import React from "react";
import {PropTypes} from "prop-types";
import {Redirect} from "react-router";
import {connect} from "react-redux";
import userSignupRequest from "./signupAction";
import addMessage from "../common/flashMessage";
import TextFieldInput from "../common/TextFieldInput";
import validateInput from "./signupValidation";

class SignupForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: {},
      isLoading: false,
      redirect: false,
      invalid: false
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  isValid() {
    const { errors, isValid } = validateInput(this.state);

    if(!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }
  onSubmit(e) {
    e.preventDefault();
    if(this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      this.props.userSignupRequest(this.state).then(
        () => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You signed up successfully. Welcome!'
          });
          this.setState({ redirect: true });
        }
        ,
        (err) => this.setState({ errors: err.data, isLoading: false })
      );
    }
  }
  
  render () {
    const errors = this.state.errors;
    return (
      <div>
        {this.state.redirect ? <Redirect to="/" /> :
          <form onSubmit={this.onSubmit}>
            <h1>Join our community!</h1>

            <TextFieldGroup
              field="username"
              value={this.state.username}
              label="Username"
              error={errors.username}
              onChange={this.onChange}
              onBlur={this.checkUserExists}
            />
            <TextFieldGroup
              field="email"
              value={this.state.email}
              label="Email"
              error={errors.email}
              onChange={this.onChange}
              onBlur={this.checkUserExists}
            />
            <TextFieldGroup
              field="password"
              value={this.state.password}
              label="Password"
              error={errors.password}
              onChange={this.onChange}
              type="password"
            />
            <TextFieldGroup
              field="passwordConfirmation"
              value={this.state.passwordConfirmation}
              label="Password Confirmation"
              error={errors.passwordConfirmation}
              onChange={this.onChange}
              type="password"
            />
           
            <div className="form-group">
              <button disabled={this.state.isLoading || this.state.invalid} className="btn btn-primary btn-lg">
                Sign up
              </button>
            </div>
          </form>
        }
      </div>
    )
  }
}

SignupForm.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

export default connect(null,
  { userSignupRequest, addFlashMessage})
  (SignupForm);