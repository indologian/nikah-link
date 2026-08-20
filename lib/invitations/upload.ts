import { uploadInvitationAssetAction } from "@/actions/invitations/invitation";

export async function uploadInvitationFile(file: File, kind: "image" | "audio") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);
  return uploadInvitationAssetAction(formData);
}
