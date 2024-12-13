import { useNavigate } from 'react-router';
import './helpCenter.scss';

export const TermsAndCondition = () => {
  const navigate = useNavigate();
  return (
    <div className="help-container">
      <div className="help-wrapper">
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/codefend/fav.png" alt="" />
          <span>Codefend</span>
        </div>
        <h2>Terms and Conditions of Service of Codefend LLC</h2>
        <article className="help-article-card">
          <h4>Summary of terms and conditions</h4>
          <h3>1- Acceptance of Terms</h3>
          <p>
            By accessing and using the services of Codefend LLC, you agree to be bound by these
            terms and conditions. If you do not agree with any term or condition, you must refrain
            from using our services.
          </p>
          <h3>2- Service Description</h3>
          <p>
            Codefend LLC provides computer security testing services, which include but are not
            limited to penetration testing, vulnerability assessment, and security auditing, by
            employing cybersecurity experts (referred to as "hackers") to assess the robustness of
            clients' IT infrastructures.
          </p>
          <h3>3- Client Responsibility</h3>
          <p>
            The client is responsible for obtaining all necessary permissions and authorizations for
            the conduct of security tests on their infrastructure. If the client fails to obtain
            such permissions and authorizations, they will be solely liable for any legal
            consequences, and Codefend LLC reserves the right to terminate the service immediately.
          </p>
          <h3>4- Codefend LLC's Disclaimer of Liability</h3>
          <p>
            Codefend LLC will not be liable for any damage, loss, or harm caused directly or
            indirectly by the security tests performed. This includes, but is not limited to, any
            business interruption, data loss, or damage to the client's infrastructure.
          </p>
          <h3>5- Use of Services</h3>
          <p>
            The services of Codefend LLC must be used solely for legal purposes and in accordance
            with all applicable laws and regulations. The client agrees not to use the services for
            illegal or unauthorized activities.
          </p>
          <h3>6- Limitation of Liability</h3>
          <p>
            In no event shall Codefend LLC be liable for any indirect, incidental, special,
            consequential, or punitive damages, including, without limitation, loss of profits,
            data, use, goodwill, or other intangible losses, resulting from the use or inability to
            use the services.
          </p>
          <h3>7- Indemnification</h3>
          <p>
            The client agrees to indemnify and hold harmless Codefend LLC from any claim, loss,
            damage, judgment, legal fees, and costs incurred due to the use of Codefend LLC's
            services, including but not limited to claims arising from unauthorized testing, data
            breaches, and violations of laws and regulations.
          </p>
          <h3>8- Warranty Disclaimer</h3>
          <p>
            The services of Codefend LLC are provided "as is" and "as available," without any kind
            of warranties, either express or implied.
          </p>
          <h3>9- Termination of Service</h3>
          <p>
            Codefend LLC reserves the right to terminate the client's use of the service for any
            reason, including but not limited to non-payment or violation of these terms and
            conditions. Codefend LLC will provide the client with a notice of termination at least
            30 days in advance. No refunds will be given for services rendered prior to the
            termination.
          </p>
          <h3>10- Dispute Resolution</h3>
          <p>
            Any dispute between Codefend LLC and the client shall be resolved by arbitration in the
            State of Delaware.
          </p>
          <h3>11- Intellectual Property Rights</h3>
          <p>
            All results of the security tests, methodologies, techniques, and any other intellectual
            property created as a result of using the services are the property of Codefend LLC
            unless otherwise agreed in writing.
          </p>
          <h3>12- Modifications to the Service and Terms</h3>
          <p>
            Codefend LLC reserves the right to modify or discontinue the service with or without
            prior notice to the client. Codefend LLC will not be liable to the client or third
            parties for any modification, price change, suspension, or discontinuance of the
            service.
          </p>
          <h3>13- Jurisdiction and Applicable Law</h3>
          <p>
            These terms and conditions shall be governed by and construed in accordance with the
            laws of the State of Delaware, without giving effect to any principles of conflicts of
            law.
          </p>
          <h3>14- Entire Agreement</h3>
          <p>
            These terms and conditions constitute the entire agreement between Codefend LLC and the
            client regarding the use of the services and supersede and replace all prior agreements,
            whether written or oral.
          </p>
          <h3>15- Contact</h3>
          <p>
            For any questions or additional information about these terms and conditions, please
            contact Codefend LLC at laws@codefend.com.
          </p>
        </article>
      </div>
    </div>
  );
};
