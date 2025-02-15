export const Logo = ({ ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...rest} translate="no">
      <div className="flex flex-row ">
        <span className=" text-contai-white text-3xl font-bold">Cont</span>
        <span className=" text-contai-lightBlue text-3xl font-bold -ml-0.5">
          aí!
        </span>
      </div>
    </div>
  );
};
