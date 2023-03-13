import Image from "next/image";
import Link from "next/link";
import React from "react";
import img from "../../src/img/assets/error.png";
import { log } from "next-axiom";

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    log.warn("Error boundary", { error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if ((this.state as any).hasError) {
      // You can render any custom fallback UI
      return (
        <div className="h-full grid place-items-center text-[#4F4F4F] p-6">
          <div className="h-fit w-full">
            <div className="relative w-full sm:w-1/2 md:w-1/3 mx-auto aspect-square">
              <Image src={img} alt="" fill />
            </div>

            <p className="text-sm max-w-[402] text-center">
              <span className="font-semibold text-xl mb-1 inline-block">
                we encountered an error.
              </span>
              <br /> our development team has been contacted and it will be
              fixed soonest
              <br />
              <Link href="/" className="font-semibold underline">
                homepage
              </Link>
            </p>
          </div>
        </div>
      );
    }

    // Return children components in case of no error

    return (this.props as any).children;
  }
}

export default ErrorBoundary;
