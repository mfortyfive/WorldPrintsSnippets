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
import hero4 from '../assets/images/hero-bg/hero-2.jpg';
import usersServices from '../services/usersService';
import toastr from 'toastr';
import { Formik, Field, Form } from 'formik';
import PropTypes from 'prop-types';
import YupRegistration from '../components/forms/validate/YupRegistration';

const _logger = debug.extend('registration');

export default function Register() {
  const history = useHistory();

  const handleOnSubmit = (payload) => {
    payload.roleId = 1;
    usersServices.register(payload).then(onRegisterSuccess).catch(onRegisterFail);
  };

  const onRegisterSuccess = (dataReturned) => {
    toastr['success'](
      'New Account Created! Please check your email to complete your registration.'
    );
    history.push('/login');
    _logger('Register Success:', dataReturned);
  };

  const onRegisterFail = (error) => {
    toastr['error']('There was a problem creating a new account.');
    _logger(error);
  };

  const handleLogIn = () => {
    history.push('/login');
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
                          <h3 className="display-4 mb-2 font-weight-bold">
                            Create a New Account
                          </h3>
                          <p className="font-size-lg mb-5 text-black-50">
                            Have great ideas for a shirt? Let&apos;s make it happen!
                          </p>
                        </div>
                        <Formik
                          initialValues={{
                            email: '',
                            password: '',
                            confirmPassword: ''
                          }}
                          validationSchema={YupRegistration}
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
                                  You must enter a valid password that meets the following
                                  critieria:<ul>
                                    <li>Contains at least 8 characters</li>
                                    <li>Contains at least 1 uppercase letter</li>
                                    <li>Contains at least 1 lowercase letter</li>
                                    <li>Contains at least 1 number</li>
                                    <li>
                                      Contains at least 1 special character ( #, ?, !, @,
                                      $, %, ^, &, *, - )
                                    </li>
                                  </ul>
                                </FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <label
                                  htmlFor="confirmPassword"
                                  className="font-weight-bold"
                                >
                                  Confirm Password
                                </label>
                                <Field
                                  as={Input}
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  placeholder="Confirm your password"
                                  type="password"
                                  valid={
                                    touched.confirmPassword ? errors.confirmPassword ? (
                                      false
                                    ) : (
                                      true
                                    ) : (
                                      false
                                    )
                                  }
                                  invalid={
                                    touched.confirmPassword ? errors.confirmPassword ? (
                                      true
                                    ) : (
                                      false
                                    ) : (
                                      false
                                    )
                                  }
                                />
                                <FormFeedback>Passwords do not match</FormFeedback>
                              </FormGroup>
                              <div className="form-group mb-5">
                                By clicking the <strong>Create account</strong> button
                                below you agree to our terms of service and privacy
                                statement.
                              </div>

                              <Button
                                color="primary"
                                size="lg"
                                block={true}
                                className="mb-5"
                                type="submit"
                              >
                                Create Account
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
                          style={{ backgroundImage: 'url(' + hero4 + ')' }}
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
                                onClick={handleLogIn}
                              >
                                <span className="btn-wrapper--label">
                                  I already have an account!
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

Register.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  confirmPassword: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  valid: PropTypes.bool,
  invalid: PropTypes.bool
};
