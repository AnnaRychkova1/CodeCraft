import LoginForm from "@/components/Forms/AuthUserForms/LoginForm";

export default function LoginPage() {
  return (
    <section className="sectionAuth">
      <h2 className="title">Login</h2>
      <LoginForm />
      <div className="redirectContainer">
        <p>Don&rsquo;t have an account?</p>
        <a className="redirectLink" href="/register">
          Register
        </a>
      </div>
    </section>
  );
}
