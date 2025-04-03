export enum RESOURCE_CLASS {
  MOBILE = 'mobile',
  WEB = 'web',
  CLOUD = 'cloud',
  NETWORK = 'network',
  SOURCE = 'source',
  SOCIAL = 'social',
  RESEARCH = 'research',
  UNKNOWN = 'unknown',
}

export enum RESOURCE_CLASS_ALIAS {
  MOBILE = 'm',
  WEB = 'w',
  CLOUD = 'c',
  SOURCE = 'sc',
  SOCIAL = 's',
  NETWORK = 'n',
  RESEARCH = 'r',
  UNKNOWN = 'u',
}

export enum MODAL_KEY_OPEN {
  LOGOUT = 'logout',

  ADD_NETWORK = 'add_access_point',
  ADD_SUB_NETWORK = 'add_network_device',
  ADD_MEMBER = 'add_member',
  ADD_SOURCE = 'add_repository',
  ADD_TICKET = 'add_ticket',
  ADD_DOMAIN = 'add_domain',
  ADD_SUB_DOMAIN = 'add_subdomain',

  START_AUTO_SCAN = 'confirm_autoscan_web',

  DELETE_NETWORK = 'delete_resource',
  DELETE_TICKET = 'delete_ticket',
  DELETE_SOURCE = 'delete_resource',
  DELETE_MEMBER = 'delete',
  DELETE_WEB = 'delete_web',

  NETWORK_SETTING = 'network',
  ERROR_CONNECTION = 'error',
  ERROR_STATE = 'SVESM',

  SELECT_REPORT = 'selectReport',
  SELECT_FINDING = 'selectFinding',
  NETWORK_CREDS = 'lan',
  REVOKE_USER = 'revoke',
  ADD_COLLABORATOR = 'add-collaborator',

  WEB_WELCOME = 'open-ww',

  USER_WELCOME = 'open-w',
  USER_GUIDE = 'open-g',
  USER_NEXUS_WELCOME = 'open-n',

  USER_WELCOME_DOMAIN = 'owund',
  USER_WELCOME_SCAN = 'ouwss',
  USER_WELCOME_FINISH = 'ouwfsf',

  USER_SELECT_RESOURCE = 'open-lfr',
}

export enum TABLE_KEYS {
  ID = 'id',
  COUNT_ISSUE = 'final_issues',
  FULL_ROW = 'full',
  FULL_WITH_NEXT = 'full-c',
  ACTION = 'action',
  ITEM_CLASS = '.item',
  ITEM_ROW_ID = 'data-id',
  ITEMS = 'selected',
}

export enum COMUNIQUE_KEYS {
  ID = 'comunique_active_id',
}

export const webEmptyScreen = {
  type: RESOURCE_CLASS.WEB,
  title: 'Add a new web resource',
  subtitle:
    "In this section, you can add new web resources such as websites and web applications. Once you've added the desired resources, you can request a web application penetration test to assess their security.",
  btnText: 'Add web resource',
};

export const mobileEmptyScreen = {
  type: RESOURCE_CLASS.MOBILE,
  title: 'There’s no data to display here',
  subtitle: 'Begin by adding a new mobile application',
  btnText: 'Add mobile application',
};

export const cloudEmptyScreen = {
  type: 'cloud',
  title: 'There’s no data to display here',
  subtitle: 'Begin by adding a new cloud resource.',
  btnText: 'Add cloud resource',
};

export const socialEmptyScreen = {
  type: RESOURCE_CLASS.SOCIAL,
  title: 'Social Engineering Resources',
  subtitle: 'Begin by adding a new individual.',
  btnText: 'Add social resource',
};

export const sourceEmptyScreen = {
  type: RESOURCE_CLASS.SOURCE,
  title: "There's no data to display here",
  subtitle: 'Begin by adding a new source code resource',
  btnText: 'Add source code',
};

export const networkEmptyScreen = {
  type: 'network',
  title: "There's no data to display here",
  subtitle: 'Begin by adding a new network structure',
  btnText: 'Add network resource',
};
