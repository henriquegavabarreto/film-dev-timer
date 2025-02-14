// Basic info about this application
export default function Home() {
  return (
    <div>
      <h1 className="m-5 text-2xl font-bold text-center">My Film Development Workflow</h1>
      <h3 className="mx-10 mb-5 mt-10 text-xl font-semibold">What Is This?</h3>
      <p className="mx-10 w-1/2">
          This web application is a simple tool designed to organize your film development workflows 
          and information. It generates timers for each step of the process and helps you keep track 
          of your workflow usage over time.
      </p>
      <h3 className="mx-10 mb-5 mt-10 text-xl font-semibold">What Are Workflows?</h3>
      <p className="mx-10 w-1/2">
          Workflows are sequences of timed steps that guide your film development process. Since every 
          photographer's approach is unique, workflows are fully customizable.<br/>
          After creating an account and logging in, you can create new workflows and access them in your 
          workflow list.<br/>
          For each step, you can add details like the volume and dilution of chemicals, the type of 
          chemical used, your agitation method, and any other relevant information to support your process.
      </p>
      <h3 className="mx-10 mb-5 mt-10 text-xl font-semibold">What is History For?</h3>
      <p className="mx-10 w-1/2">
          It is a way to track your workflow use. After completing a development process, you can save it 
          to your history and add a note for future reference, if desired.
      </p>
      <h3 className="mx-10 mb-5 mt-10 text-xl font-semibold">My screen locks even when the timer is on. How do I fix this?</h3>
      <p className="mx-10 w-1/2">
          Change the display auto-lock settings of your device.
      </p>
    </div>
  );
}
