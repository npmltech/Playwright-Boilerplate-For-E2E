export const loginLocator = {
  accountMenuLink: 'a.menu_account',
  loginMenuLink: "a[href*='rt=account/login']",
  usernameInput: '#loginFrm_loginname',
  passwordInput: '#loginFrm_password',
  submitButton: "#loginFrm button[title='Login']",
  forgotPasswordLink: "a[href*='rt=account/forgotten/password']",
  accountContainer: '#maincontainer',
  logoutMenuLink: "a[href*='rt=account/logout']:visible",
  errorAlert: '.alert.alert-error, .alert.alert-danger',
  forgottenForm: '#forgottenFrm',
} as const;
