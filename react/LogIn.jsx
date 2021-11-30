import React from 'react';
import { useHistory } from 'react-router-dom';
import debug from 'sabio-debug';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Row,
  Col,
  FormGroup,
  Input,
  UncontrolledTooltip,
  Nav,
  NavItem,
  Button,
  FormFeedback
} from 'reactstrap';
import { NavLink as NavLinkStrap } from 'reactstrap';
import hero2 from '../assets/images/hero-bg/hero-2.jpg';
import usersServices from '../services/usersService';
import toastr from 'toastr';
import { Formik, Field, Form } from 'formik';
import PropTypes from 'prop-types';
import YupLogin from '../components/forms/validate/YupLogin';

const _logger = debug.extend('login');

export default function LogIn() {
  const history = useHistory();

  const handleOnSubmit = (payload) => {
    usersServices
      .login(payload)
      .then(usersServices.getCurrent)
      .then(onLogInSuccess)
      .catch(onLoginFail);
  };

  const onLogInSuccess = (dataReturned) => {
    let user = dataReturned.item;
    _logger(user);
    user.isLoggedIn = true;
    toastr['success']('Welcome back! You are logged in.');
    history.push('/', {
      type: 'LogIn',
      payload: user
    });
  };

  const onLoginFail = (error) => {
    toastr['error']('User email or password is incorrect.');
    _logger(error);
  };

  const handleRegister = () => {
    history.push('/register');
  };

  return (
    <div className="app-wrapper min-vh-100 bg-white">
      <div className="app-main min-vh-100">
        <div className="app-content p-0">
          <div className="app-inner-content-layout--main">
            <div className="flex-grow-1 w-100 d-flex align-items-center">
              <div className="bg-composed-wrapper--content">
                <Row className="min-vh-100 no-gutters">
                  <Col lg="7" xl="6" className="d-flex align-items-center">
                    <Col md="10" lg="8" xl="7" className="mx-auto">
                      <div className="py-4">
                        <div className="text-center">
                          <h3 className="display-4 mb-2 font-weight-bold">Log In</h3>
                        </div>
                        <Formik
                          initialValues={{
                            email: '',
                            password: ''
                          }}
                          validationSchema={YupLogin}
                          validateOnChange={true}
                          onSubmit={async (values) => {
                            await new Promise((r) => setTimeout(r, 500));
                            handleOnSubmit(values);
                          }}
                        >
                          {({ errors, touched }) => (
                            <Form>
                              <FormGroup>
                                <label htmlFor="email" className="font-weight-bold">
                                  Your Email
                                </label>
                                <Field
                                  as={Input}
                                  id="email"
                                  name="email"
                                  placeholder="Enter your email"
                                  type="email"
                                  valid={
                                    touched.email ? errors.email ? false : true : false
                                  }
                                  invalid={
                                    touched.email ? errors.email ? true : false : false
                                  }
                                />
                                <FormFeedback>You must enter a valid email</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <label htmlFor="password" className="font-weight-bold">
                                  Password
                                </label>
                                <Field
                                  as={Input}
                                  id="password"
                                  name="password"
                                  placeholder="Enter a password"
                                  type="password"
                                  valid={
                                    touched.password ? errors.password ? (
                                      false
                                    ) : (
                                      true
                                    ) : (
                                      false
                                    )
                                  }
                                  invalid={
                                    touched.password ? errors.password ? (
                                      true
                                    ) : (
                                      false
                                    ) : (
                                      false
                                    )
                                  }
                                />
                                <FormFeedback>
                                  You must enter a valid password
                                </FormFeedback>
                              </FormGroup>
                              <div>
                                <br />
                              </div>

                              <Button
                                color="primary"
                                size="lg"
                                block={true}
                                className="mb-5"
                                type="submit"
                              >
                                Log In
                              </Button>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    </Col>
                  </Col>
                  <Col lg="5" xl="6" className="d-flex">
                    <div className="hero-wrapper w-100 bg-composed-wrapper bg-dark min-vh-lg-100">
                      <div className="flex-grow-1 w-100 d-flex align-items-center">
                        <div
                          className="bg-composed-wrapper--image opacity-5"
                          style={{ backgroundImage: 'url(' + hero2 + ')' }}
                        />
                        <div className="bg-composed-wrapper--bg bg-second opacity-5" />
                        <div className="bg-composed-wrapper--bg bg-deep-sky opacity-2" />
                        <div className="bg-composed-wrapper--content text-center p-5">
                          <div className="text-white px-0 px-lg-2 px-xl-4">
                            <h1 className="display-3 mb-4 font-weight-bold">
                              Welcome to World Print!
                            </h1>
                            <p className="font-size-lg mb-0 opacity-8">
                              Lets make your design come to life.<br />
                              Get started by making a free account, and a fresh pot of
                              coffee.
                            </p>
                            <div className="divider mx-auto border-1 my-5 border-light opacity-2 rounded w-25" />
                            <div>
                              <Button
                                color="warning"
                                className="px-5 font-size-sm font-weight-bold btn-animated-icon text-uppercase rounded shadow-none py-3 hover-scale-sm hover-scale-lg"
                                onClick={handleRegister}
                              >
                                <span className="btn-wrapper--label">
                                  Don&apos;t have an account yet?
                                </span>
                                <span className="btn-wrapper--icon">
                                  <FontAwesomeIcon icon={[ 'fas', 'arrow-right' ]} />
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* todo: change social media icons and links below */}

                      <div className="hero-footer pb-4">
                        <Nav pills className="nav-neutral-secondary">
                          <NavItem>
                            <NavLinkStrap
                              href="#/"
                              onClick={(e) => e.preventDefault()}
                              className="font-size-lg text-white-50"
                              id="FacebookTooltipExample7"
                            >
                              <FontAwesomeIcon icon={[ 'fab', 'facebook' ]} />
                            </NavLinkStrap>
                            <UncontrolledTooltip
                              target="FacebookTooltipExample7"
                              container="body"
                            >
                              Facebook
                            </UncontrolledTooltip>
                          </NavItem>
                          <NavItem>
                            <NavLinkStrap
                              href="#/"
                              onClick={(e) => e.preventDefault()}
                              className="font-size-lg text-white-50"
                              id="btnTwitterTooltip"
                            >
                              <FontAwesomeIcon icon={[ 'fab', 'twitter' ]} />
                            </NavLinkStrap>
                            <UncontrolledTooltip target="btnTwitterTooltip">
                              Twitter
                            </UncontrolledTooltip>
                          </NavItem>
                          <NavItem>
                            <NavLinkStrap
                              href="#/"
                              onClick={(e) => e.preventDefault()}
                              className="font-size-lg text-white-50"
                              id="btnGoogleTooltip"
                            >
                              <FontAwesomeIcon icon={[ 'fab', 'google' ]} />
                            </NavLinkStrap>
                            <UncontrolledTooltip target="btnGoogleTooltip">
                              Google
                            </UncontrolledTooltip>
                          </NavItem>
                          <NavItem>
                            <NavLinkStrap
                              href="#/"
                              onClick={(e) => e.preventDefault()}
                              className="font-size-lg text-white-50"
                              id="btnInstagramTooltip"
                            >
                              <FontAwesomeIcon icon={[ 'fab', 'instagram' ]} />
                            </NavLinkStrap>
                            <UncontrolledTooltip target="btnInstagramTooltip">
                              Instagram
                            </UncontrolledTooltip>
                          </NavItem>
                        </Nav>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

LogIn.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  confirmPassword: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  valid: PropTypes.bool,
  invalid: PropTypes.bool
};
