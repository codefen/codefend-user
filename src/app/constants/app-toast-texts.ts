//Textos genericos
export enum APP_MESSAGE_TOAST {
  API_UNEXPECTED_ERROR = 'An unexpected error has occurred on the server.',
  USER_INFO_NOT_FOUND = 'User information not found.',
  SESSION_EXPIRED = 'Your session has expired.',
  SEARCH_NOT_FOUND = 'No search results found.',
  ADD_CREDENTIAL = 'Credential added successfully.',
  INVALID_API_URL = 'Invalid API URL: too short.',
  SERVER_UPDATED = 'Server updated successfully.',
  COPY_TEXT = 'Text successfully copied to clipboard.',
  FAILURE_COPY = 'Failed to copy text to clipboard.',
  START_SCAN = 'New AI scan launched',
  SCAN_INFO = 'The scan has started. Please wait a few minutes, and you will see the results.',
}

export enum CHATBOX_TEXT {
  EMPTY_MESSAGE = 'Please enter a message.',
  WAIT_FOR_RESPONSE = 'We respond to inquiries within 24 to 48 hours.',
  VIEW_MESSAGE = 'viewmessage',
}

export enum DASHBOARD_PANEL_TEXT {
  EMPTY_CLASS_SEARCH = 'Please select a class to search.',
}

export enum ISSUE_PANEL_TEXT {
  EMPTY_ISSUE_RISK = 'Invalid risk score. Please provide a valid risk score for the issue.',
  EMPTY_ISSUE_NAME = 'Invalid issue name. Please provide a name for the issue.',
  EMPTY_ISSUE_CONT = 'Content missing. Please add content using the editor.',
  EMPTY_ISSUE_CLASS = 'Invalid issue class. Please select a valid class for the issue.',
  DELETED_ISSUE = 'Issue successfully deleted.',
  ADD_ISSUE = 'Issue successfully added.',
  UPDATED_ISSUE = 'Issue successfully updated.',
}

export enum PREFERENCE_PANEL_TEXT {
  GUEST_COLABORATOR = 'The invitation has been sent to the specified email.',
  REVOKE_USER_ACCESS = 'Access has been successfully revoked',
  INVALID_COLABORATOR_EMAIL = "Please enter the collaborator's email.",
}

export enum SUPPORT_PANEL_TEXT {
  EMPTY_TICKET_TITLE = 'Invalid title. Please provide a title for the ticket.',
  EMPTY_TICKET_DESC = 'Invalid description. Please provide a description for the ticket.',
  ADD_TICKET = 'Ticket successfully added.',
  DELETED_TICKET = 'Ticket successfully deleted.',
}

export enum CLOUD_PANEL_TEXT {
  ADD_CLOUD = 'Cloud successfully added.',
  EMPTY_CLOUD_PROV = 'Please select a cloud provider.',
  EMPTY_CLOUD_NAME = 'Invalid name. Please provide a name for the cloud resource.',

  DELETED_CLOUD = 'Cloud successfully deleted.',
}

export enum MOBILE_PANEL_TEXT {
  INVALID_ANDROID = 'Invalid Android address.',
  INVALID_IOS = 'Invalid iOS address.',
  EMPTY_MOBILE_APP = 'Please add at least one Android or iOS application.',
  ADD_MOBILE = 'Mobile application successfully added.',

  DELETED_MOBILE = 'Mobile application successfully deleted.',
}

export enum NETWORK_PANEL_TEXT {
  ADD_LAN = 'Network resource successfully added.',
  INVALID_LAN_IN_ADDRESS = 'Invalid internal address. Please provide a valid internal address.',
  INVALID_LAN_EX_ADDRESS = 'Invalid external address. Please provide a valid external address.',
  ADD_SUB_NETWORK = 'Subnetwork successfully added.',
  INVALID_DAD_NETWORK = 'Invalid main network resource.',
  DELETED_LAN = 'Network resource successfully deleted.',
}

export enum SOCIAL_PANEL_TEXT {
  INVALID_NAME = 'Invalid name. Please provide a valid name.',
  INVALID_FAMILY_NAME = 'Invalid family name. Please provide a valid family name.',
  INVALID_EMAIL = 'Invalid email. Please provide a valid email.',
  INVALID_PHONE = 'Invalid phone number. Please provide a valid phone number.',
  INVALID_ROLE = 'Invalid role. Please provide a role.',
  ADD_SOCIAL_MEMBER = 'Member successfully added.',
  DELETED_SOCIAL = 'Member successfully deleted.',
}

export enum SOURCE_PANEL_TEXT {
  EMPTY_NAME = 'Invalid name. Please provide a name.',
  EMPTY_REPOSITORY_URL = 'Invalid repository URL. Please provide a valid repository URL.',
  EMPTY_SOURCE_CODE_LANGUAGE = 'Invalid language. Please specify the source code language.',
  EMPTY_REPO_VISIBILITY = 'Invalid repository visibility. Please select a repository visibility.',
  ADD_SOURCE = 'Repository successfully added.',
  DELETED_SOURCE = 'Repository successfully deleted.',
}

export enum WEB_PANEL_TEXT {
  INVALID_DAD_DOMAIN = 'Invalid main resource. Please select a valid main resource.',
  INVALID_DOMAIN = 'Invalid domain. Please provide a valid domain.',
  INVALID_SUB_DOMAIN = 'Invalid subdomain. Please provide a valid subdomain.',

  SAVING_DOMAIN = 'Saving domain...',
  SAVING_SUB_DOMAIN = 'Saving subdomain...',
  ADD_DOMAIN = 'Domain successfully added.',
  ADD_SUB_DOMAIN = 'Subdomain successfully added.',
  DELETED_WEB = 'Web resources successfully deleted.',
  VERIFY_DOMAIN = 'Verifying the domain',
}

export enum AUTH_TEXT {
	LOGIN_SUCCESS = 'Successfully logged in.',
	REGISTER_PHASE_ONE = 'Registration successful. Please check your email to activate your account.',
	FINISH_REGISTER = 'Registration complete. You can now sign in.',
	INVALID_PASSWORD = 'Invalid password. Please provide a valid password.',
	PASSWORD_NOT_MATCH = 'The passwords you sent do not match.',
	INVALID_DOMAIN = 'Please enter a valid domain (e.g., yourcompany.com). Emails are not allowed.',
	DOMAIN_NOT_EMAIL = 'Business website must be a domain, not an email address.',
	DOMAIN_INVALID_FORMAT = 'Invalid domain format. Please enter a valid domain like yourcompany.com',

	SEND_RECOVERY_CODE = 'Check your inbox!',
	PASSWORD_UPDATED = 'Password successfully updated.',
	FAILURE_PASSWORD_UPDATED = 'Unable to update the password. Please try generating a new recovery code.',
}

export enum PROVIDER_PANEL_TEXT {
  ACCEPTED_ORDER = 'Order successfully accepted.',
  FAILURE_ACCEPT_ORDER = 'Unable to accept the order. Please try again.',
  ORDER_FINISHED = 'Order successfully completed.',
  FAILURE_ORDER_FINISHED = 'An error occurred while completing the order. Please try again in a few minutes.',
  REFUSED_ORDER = 'Order successfully refused.',
  FAILURE_REFUSE_ORDER = 'Unable to refuse the order. Please try again in a few minutes.',
  TRANSFER_ORDER = 'Order successfully transferred.',
}

export enum ORDER_PHASES_TEXT {
  ORDER_NEST_ERROR = 'An error occurred while processing the order.',
  FULL_FOR_ADVERSARY = 'You can only designate an adversary if the plan is full.',
}

export enum SCAN_PAGE_TEXT {
  SCAN_KILLED_SUCCESS = 'The process has been completed successfully',
  SCAN_KILL_NO_SELECTED = 'No process has been selected to kill',
}
