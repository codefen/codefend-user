import { useNavigate } from 'react-router';
import './helpCenter.scss';

export const SecurityAndPrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="help-container">
      <div className="help-wrapper">
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/codefend/fav.png" alt="" />
          <span>Codefend</span>
        </div>
        <h2>Privacy Policy of Codefend LLC</h2>
        <article className="help-article-card">
          <h4>Summary of terms and conditions</h4>
          <h3>1- Introduction</h3>
          <p>
            Codefend LLC respects the privacy of our clients and is committed to protecting your
            personal information. This privacy policy outlines how we collect, use, store, and
            protect your personal data.
          </p>
          <h3>2- Information Collection</h3>
          <p>
            We may collect personal information, including, but not limited to, names, addresses,
            email addresses, IT infrastructure details, IP addresses, and cookies of our clients.
            This collection is essential for providing our security testing services.
          </p>
          <h3>3- Use of Information</h3>
          <p>
            Collected information will be used solely for providing, improving, and personalizing
            our services. This includes communicating with clients, planning and executing security
            tests, and continually enhancing our service offerings.
          </p>
          <h3>4- Sharing of Information</h3>
          <p>
            We do not share your personal information with third parties, except as necessary to
            provide our services or as required by law.
          </p>
          <h3>5- Storage and Security of Information</h3>
          <p>
            All personal data is securely stored in the United States or Bahrain, safeguarded
            against unauthorized access, alteration, disclosure, or destruction. We employ
            state-of-the-art information security standards to ensure the protection of our clients'
            data.
          </p>
          <h3>6- User Rights</h3>
          <p>
            Users have the right to access, correct, or delete their personal information held by
            us. Requests for data access, correction, or deletion can be directed to our contact
            email at laws@codefend.com.
          </p>
          <h3>7- Data Breach Notification Procedures</h3>
          <p>
            In the unlikely event of a security breach leading to unauthorized access to personal
            data, Codefend LLC will promptly mitigate the incident and notify affected clients
            within 72 hours, in compliance with applicable laws and regulations.
          </p>
          <h3>8- Compliance with U.S. Laws</h3>
          <p>
            Our privacy practices are designed to comply with the General Data Protection Regulation
            (GDPR) for dealing with European customers and the California Consumer Privacy Act
            (CCPA) along with other relevant federal and state laws.
          </p>
          <h3>9- Data Retention</h3>
          <p>
            We retain personal data for a period of five years or as long as necessary to provide
            the services requested by our clients, or as required by law.
          </p>
          <h3>10- Loss of Data</h3>
          <p>
            While we implement data backup and recovery strategies, Codefend LLC is not liable for
            any indirect or consequential loss resulting from data loss. However, we will make
            reasonable efforts to recover lost data and mitigate any damage caused by data loss.
          </p>
          <h3>11- Changes to Privacy Policy</h3>
          <p>
            This policy may be updated periodically. Changes will be communicated to our clients
            through our usual communication channels.
          </p>
          <h3>12- Contact</h3>
          <p>
            For any questions or concerns about our privacy policy, please contact Codefend LLC at
            laws@codefend.com.
          </p>
        </article>
      </div>
    </div>
  );
};
