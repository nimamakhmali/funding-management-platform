import ChooseUserAccount from "./ChooseUserAccount";

export default function CompleteUserInformationContainerForm() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#eaddff] overflow-hidden relative mb-10 p-6 md:p-10 ">
      <div className="h-1 bg-primary w-full rounded-full absolute -right-1 top-0" />
      <h2 className="text-sm font-bold text-text-main mb-4 block">
        انتخاب نوع حساب کاربری
      </h2>
      <ChooseUserAccount />
    </div>
  );
}
