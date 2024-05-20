export enum RESOURCE_CLASS {
    MOBILE="mobile",
    WEB="web",
    CLOUD="cloud",
    NETWORK="network",
    SOURCE="source",
    SOCIAL="social",
    RESEARCH="research",
    UNKNOWN="unknown"
}

export enum RESOURCE_CLASS_ALIAS {
    MOBILE="m",
    WEB="w",
    CLOUD="c",
    SOURCE="sc",
    SOCIAL="s",
    NETWORK="n",
    RESEARCH="r",
    UNKNOWN="u"
}

export enum MODAL_KEY_OPEN {
    LOGOUT="logout",
    ADD_NETWORK="add_access_point",
    ADD_SUB_NETWORK="add_network_device",
    ADD_MEMBER="add_member",
    ADD_SOURCE="add_repository",
    ADD_TICKET="add_ticket",
    ADD_DOMAIN="add_domain",
    ADD_SUB_DOMAIN="add_subdomain",
    DELETE_NETWORK="delete_resource",
    DELETE_TICKET="delete_ticket",
    DELETE_SOURCE="delete_resource",
    DELETE_MEMBER="delete",
    DELETE_WEB="delete_web",

    NETWORK_SETTING="network",
    ERROR_CONNECTION="error",
    ERROR_STATE="SVESM",

    SELECT_REPORT="selectReport",
    SELECT_FINDING="selectFinding",
    NETWORK_CREDS="lan",
    REVOKE_USER="revoke",
    ADD_COLLABORATOR="add-collaborator",

}