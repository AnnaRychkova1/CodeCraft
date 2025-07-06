import RegisterForm from "@/components/Forms/AuthUserForms/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="sectionAuth">
      <h2 className="title">Register</h2>
      <RegisterForm />
      <div className="redirectContainer">
        <p>Already have an account?</p>
        <a className="redirectLink" href="/login">
          Login
        </a>
      </div>
    </section>
  );
}
