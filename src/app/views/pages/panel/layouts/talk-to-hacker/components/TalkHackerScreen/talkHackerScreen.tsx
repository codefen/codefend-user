import { MessageIcon, ProfileIcon } from '@icons';
import { PrimaryButton } from '../../../../../../components/buttons/primary/PrimaryButton';

export const TalkHackerScreen = () => {
  return (
    <>
      <div className="talk-hacker_header">
        <MessageIcon />
        <h2>Outdate libraries on main website</h2>
      </div>
      <div className="talk-hacker_comments">
        <div className="comment">
          <div className="comment_header">
            <span>The customer @federico </span>
            <span>2023-10-01</span>
          </div>
          <div className="comment_body">
            <ProfileIcon />
            <p>
              I have noticed that the website is using some outdated libraries. It would be great to
              update them to the latest versions for better performance and security.
            </p>
          </div>
        </div>
        <div className="comment">
          <div className="comment_header">
            <span>Admin</span>
            <span>2023-10-02</span>
          </div>
          <div className="comment_body">
            <ProfileIcon />
            <p>
              Thank you for bringing this to our attention. We will look into it and update the
              libraries as soon as possible.
            </p>
          </div>
        </div>
      </div>
      <div className="response-hacker">
        <textarea name="" id=""></textarea>
        <PrimaryButton text="send" />
      </div>
    </>
  );
};
