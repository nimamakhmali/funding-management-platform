import { MessageContentContainer } from "@/components/pages/admin/messages/containers/MessageContentContainer";

interface Props {
  params: Promise<{
    messageId: string;
  }>;
}

export default async function MessagePage({
  params,
}: Props) {
  const { messageId } =
    await params;

  return (
    <MessageContentContainer
      messageId={messageId}
    />
  );
}