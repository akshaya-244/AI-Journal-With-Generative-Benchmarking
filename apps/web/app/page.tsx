import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Hero from "@/components/Hero";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default async function Home() {
  const session = await auth.api.getSession({headers: await headers() });
  if(session) redirect("/list-entries");
  // return (
  //   <h1> Welcome {session.user.name ?? session.user.email}</h1>
  // );
  return(
    <Hero />

  )

  
}
