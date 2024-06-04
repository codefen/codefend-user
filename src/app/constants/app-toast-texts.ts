//Textos genericos
export enum APP_MESSAGE_TOAST  {
    API_UNEXPECTED_ERROR="An unexpected error has occurred on the server",
    USER_INFO_NOT_FOUND="User information was not found",
    SESSION_EXPIRED="Your session has expired",
    SEARCH_NOT_FOUND="No results found for the search",
    ADD_CREDENTIAL="Successfully added credential...",
    INVALID_API_URL="invalid API URL, too short",
    SERVER_UPDATED="Server has been changed successfully",
    COPY_TEXT="Text copied to clipboard",
    FAILURE_COPY="Failed to copy text"
}

export enum CHATBOX_TEXT {
    EMPTY_MESSAGE="You must write a message",
    WAIT_FOR_RESPONSE="We aim to respond to your queries within 24 to 48 hours.",
    VIEW_MESSAGE="viewmessage"
}

export enum DASHBOARD_PANEL_TEXT {
    EMPTY_CLASS_SEARCH="'You must select a class to search'"
}

export enum ISSUE_PANEL_TEXT {
    EMPTY_ISSUE_RISK="Invalid risk score. Add a risk score to the issue",
    EMPTY_ISSUE_NAME="Invalid issue name. Add a name to the issue",
    EMPTY_ISSUE_CONT="Invalid content, please add content using the editor",
    EMPTY_ISSUE_CLASS="Invalid issue class",
    DELETED_ISSUE="Successfully deleted Issue...",
    ADD_ISSUE="Successfully added Issue...",
    UPDATED_ISSUE="Successfully updated Issue...",
}

export enum PREFERENCE_PANEL_TEXT {
    GUEST_COLABORATOR="The invitation has been sent the invitation to the email",
    REVOKE_USER_ACCESS="Access has been successfully revoked",
    INVALID_COLABORATOR_EMAIL="You must enter the collaborator's email"
}

export enum SUPPORT_PANEL_TEXT {
    EMPTY_TICKET_TITLE="Invalid title, please add ticket title",
    EMPTY_TICKET_DESC="Invalid description, please add description",
    ADD_TICKET="Successfully added Ticket...",
    DELETED_TICKET="Successfully deleted Ticket..."
}

export enum CLOUD_PANEL_TEXT {
    ADD_CLOUD="Successfully added Cloud...",
    EMPTY_CLOUD_PROV="Select cloud provider",
    EMPTY_CLOUD_NAME="Invalid name, please add cloud name",

    DELETED_CLOUD="Successfully deleted cloud..."
}

export enum MOBILE_PANEL_TEXT {
    INVALID_ANDROID="Invalid Android address",
    INVALID_IOS="Invalid iOS address",
    EMPTY_MOBILE_APP="Please add at least one Android or iOS app",
    ADD_MOBILE="Successfully added mobile app",

    DELETED_MOBILE="Successfully deleted mobile..."
}

export enum NETWORK_PANEL_TEXT {
    ADD_LAN="Successfully added Access Point...",
    INVALID_LAN_IN_ADDRESS="Invalid internal address, please add a valid internal address",
    INVALID_LAN_EX_ADDRESS="Invalid external address, please add a valid external address",
    ADD_SUB_NETWORK="Successfully added sub Network...",
    INVALID_DAD_NETWORK="Invalid main resource",
    DELETED_LAN="Successfully deleted network resource...",
}

export enum SOCIAL_PANEL_TEXT {
    INVALID_NAME="Invalid name, please add valid name",
    INVALID_FAMILY_NAME="Invalid family name, please add valid family name",
    INVALID_EMAIL="Invalid email, please add valid email",
    INVALID_PHONE="Invalid phone, please add valid phone",
    INVALID_ROLE="Invalid role, please add role",
    ADD_SOCIAL_MEMBER="Successfully added member...",
    DELETED_SOCIAL="Successfully deleted member...",
}

export enum SOURCE_PANEL_TEXT {
    EMPTY_NAME="Invalid name, please add name",
    EMPTY_REPOSITORY_URL="Invalid repository url, please add valid repository url",
    EMPTY_SOURCE_CODE_LANGUAGE="Invalid language, please add language",
    EMPTY_REPO_VISIBILITY="Invalid repository visibility, please select repository visibility",

    ADD_SOURCE="Successfully added repository...",
    DELETED_SOURCE="Successfully delete repository resources..."
}

export enum WEB_PANEL_TEXT {
    INVALID_DAD_DOMAIN="Invalid main resource, please select valid main resource",
    INVALID_DOMAIN="Ivalid domain, please add valid domain",
    INVALID_SUB_DOMAIN="Invalid sub domain, please add valid sub domain",

    SAVING_DOMAIN="The domain is being saved...",
    SAVING_SUB_DOMAIN="Subdomain is being saved...",
    ADD_DOMAIN="Successfully added domain...",
    ADD_SUB_DOMAIN="Successfully added sub domain...",
    DELETED_WEB="Successfully deleted web resources..."
}

export enum AUTH_TEXT {
    LOGIN_SUCCESS="Successfully logged in...",
    REGISTER_PHASE_ONE="Successfully registered. Please check your email to activate your account",
    FINISH_REGISTER="Successfully registered. You can now log in",
    INVALID_PASSWORD="Invalid password, please add valid password",
    PASSWORD_NOT_MATCH="The passwords you sent do not match",

    SEND_RECOVERY_CODE="Check your email inbox for the password change code.",
    PASSWORD_UPDATED="Successfully updated password...",
    FAILURE_PASSWORD_UPDATED="We have not been able to update the password, try generating a new code"
}

export enum PROVIDER_PANEL_TEXT {
    ACCEPTED_ORDER="You have accepted the order correctly",
    FAILURE_ACCEPT_ORDER="The order could not be accepted correctly",

    ORDER_FINISHED="You have finished the order correctly",
    FAILURE_ORDER_FINISHED="Sorry, an error occurred while completing the order, please try again in a few minutes.",

    REFUSED_ORDER="Successfully refused order...",
    FAILURE_REFUSE_ORDER="Sorry, the order could not be placed correctly, please try again in a few minutes.",

    TRANSFER_ORDER="The order has been transferred successfully",
}

export enum ORDER_PHASES_TEXT {
    ORDER_NEST_ERROR="An error occurred while continuing with the order",
    FULL_FOR_ADVERSARY="Can only be adversary if plan is full.",
}