"use client";
import { useUser } from "@/app/data/user";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";
import Button2 from "../base/Button2";
import Form from "../base/form/Form";
import Input from "../base/form/Input";
import Textarea from "../base/form/Textarea";
import CenteredLayout from "../layout/CenteredLayout";
import Spinner from "../loading/Spinner";

type Props = {
  username: string;
};

export default function ProfileEdit({ username }: Readonly<Props>) {
  const { isPending, user, mutate } = useUser(username);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const posthog = usePostHog();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  const [nameCharCount, setNameCharCount] = useState(0);
  const [bioCharCount, setBioCharCount] = useState(0);
  const NAME_CHAR_LIMIT = 25;
  const BIO_CHAR_LIMIT = 400;

  useEffect(() => {
    if (user) {
      const initialName = user.name || "";
      const initialBio = user.bio || "";

      setFormData({
        name: initialName,
        bio: initialBio,
      });

      setNameCharCount(initialName.length);
      setBioCharCount(initialBio.length);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "name" && value.length <= NAME_CHAR_LIMIT) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setNameCharCount(value.length);
    } else if (name === "bio" && value.length <= BIO_CHAR_LIMIT) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setBioCharCount(value.length);
    } else if (name !== "name" && name !== "bio") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    mutate({ name: formData.name, bio: formData.bio });
    posthog.capture("profile_update");
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    setIsSubmitting(false);
  };

  if (isPending) {
    return (
      <CenteredLayout>
        <Spinner />
      </CenteredLayout>
    );
  }

  if (!user) {
    return <h1 className="text-xl font-bold text-red-500">User not found</h1>;
  }

  return (
    <CenteredLayout>
      <div className="flex w-full flex-col border-y-1 border-neutral-800 p-4 sm:border-x-1">
        <p className="ml-1 text-lg font-black">@{user.username}</p>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={"Display name"}
            autoComplete="off"
            maxLength={NAME_CHAR_LIMIT}
          />
          <div className="w-full text-right text-xs text-neutral-400">
            {nameCharCount}/{NAME_CHAR_LIMIT}
          </div>

          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder={"Bio"}
            className="w-full rounded-lg border border-neutral-700 bg-black/20 p-2 text-white focus:border-white focus:outline-none"
            autoComplete="off"
            maxLength={BIO_CHAR_LIMIT}
          />
          <div className="w-full text-right text-xs text-neutral-400">
            {bioCharCount}/{BIO_CHAR_LIMIT}
          </div>

          <Button2
            type="submit"
            disabled={
              isSubmitting ||
              nameCharCount > NAME_CHAR_LIMIT ||
              bioCharCount > BIO_CHAR_LIMIT
            }
          >
            <div className="flex w-full flex-row justify-between">
              <div></div>
              <p>Save</p>
              <div className="relative">
                {isSubmitting && (
                  <div className="absolute top-1 -left-4">
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"></div>
                  </div>
                )}
              </div>
            </div>
          </Button2>
          <Button2 variant="outlined" onClick={() => router.back()}>
            Cancel
          </Button2>
        </Form>
      </div>
      <div
        className={`fixed bottom-14 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-neutral-600 px-4 py-2 text-white transition-all duration-300 ease-in-out ${
          showAlert
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
        role="alert"
      >
        Updated successfully
      </div>
    </CenteredLayout>
  );
}
