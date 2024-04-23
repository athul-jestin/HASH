import React, { useEffect, useState } from "react";
import Uploder from "../../../Components/Uploder";
import { Input, Message, Select } from "../../../Components/UsedInputs";
import SideBar from "../SideBar";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { ImUpload } from "react-icons/im";
import CastsModal from "../../../Components/Modals/CastsModal";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MovieValidation } from "../../../Components/Validation/Moviesvalidation";
import ImagePreview from "../../../Components/ImagePreview";
import { InlineError } from "../../../Components/Notfications/Error";
import {
  createMovieAction,
  removeCast,
} from "../../../Redux/Actions/MoviesActions";
import toast from "react-hot-toast";
import { CREATE_MOVIE_RESET } from "../../../Redux/Constants/MoviesConstants";
import { useNavigate } from "react-router-dom";

function AddMovie() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cast, setCast] = useState(null);
  const [imageWithoutTitle, setImageWithoutTitle] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get all categories
  const { categories } = useSelector((state) => state.categoriesList);
  const { isLoading, isError, isSuccess } = useSelector(
    (state) => state.createMovie
  );
  const { casts } = useSelector((state) => state.addUpdateDeleteCasts);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(MovieValidation),
  });

  // submit movie handler
  const onSubmit = (data) => {
    dispatch(
      createMovieAction({
        ...data,
        image: imageWithoutTitle,
        titleImage: imageTitle,
        video: videoUrl,
        casts,
      })
    );
  };

  // delete cast handler
  const deleteCast = (id) => {
    dispatch(removeCast(id));
    toast.success("Cast deleted successfully");
  };

  useEffect(() => {
    // if modal is false then reset the cast
    if (modalOpen === false) {
      setCast();
    }
    // if it is success then reset the form
    if (isSuccess) {
      reset({
        name: "",
        time: "",
        language: "",
        year: "",
        desc: "",
        category: "",
      });
      setImageWithoutTitle("");
      setImageTitle("");
      setVideoUrl("");
      dispatch({ type: CREATE_MOVIE_RESET });
      navigate("/addmovie");
    }
    // if it is error then show error
    if (isError) {
      toast.error(isError);
    }
  }, [modalOpen, isError, dispatch, reset, isSuccess, navigate]);

  return (
    <SideBar>
      <CastsModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        cast={cast}
      />
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Create Movie</h2>
        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="w-full">
            <Input
              label="Video Title"
              placeholder=""
              type="text"
              bg={true}
              name="name"
              register={{ ...register("name") }}
            />
            {errors.name && <InlineError message={errors.name.message} />}
          </div>
          <div className="w-full">
            <Input
              label="Hours"
              placeholder=""
              type="number"
              bg={true}
              name="time"
              register={{ ...register("time") }}
            />
            {errors.time && <InlineError message={errors.time.message} />}
          </div>
        </div>

        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="w-full">
            <Input
              label="Language Used"
              placeholder=""
              type="text"
              bg={true}
              name="language"
              register={{ ...register("language") }}
            />
            {errors.language && (
              <InlineError message={errors.language.message} />
            )}
          </div>
          <div className="w-full">
            <Input
              label="Year of Release"
              placeholder=""
              type="number"
              bg={true}
              name="year"
              register={{ ...register("year") }}
            />
            {errors.year && <InlineError message={errors.year.message} />}
          </div>
        </div>

        {/* IMAGES */}
        <div className="w-full grid md:grid-cols-2 gap-6">
          {/* img without title */}
          <div className="flex flex-col gap-2">
            <p className="text-border font-semibold text-sm">
              Image without Title
            </p>
            <Uploder setImageUrl={setImageWithoutTitle} />
            <ImagePreview
              image={imageWithoutTitle}
              name={"imageWithoutTitle"}
            />
          </div>
          {/* image with title */}
          <div className="flex flex-col gap-2">
            <p className="text-border font-semibold text-sm">
              Image with Title
            </p>
            <Uploder setImageUrl={setImageTitle} />
            <ImagePreview image={imageTitle} name={"imageTitle"} />
          </div>
        </div>
        {/* DESCRIPTION */}
        <div className="w-full">
          <Message
            label="Video   Description"
            placeholder="Make it short and sweet"
            name="desc"
            register={{ ...register("desc") }}
          />
          {errors.desc && <InlineError message={errors.desc.message} />}
        </div>
        {/* CATEGORY */}
        <div className="text-sm w-full">
          <Select
            label="Video Category"
            options={categories?.length > 0 ? categories : []}
            name="category"
            register={{ ...register("category") }}
          />
          {errors.category && <InlineError message={errors.category.message} />}
        </div>
        {/* MOVIE VIDEO */}

        <div className="flex flex-col gap-2 w-full ">
          <label className="text-border font-semibold text-sm">
            Video
          </label>
          <div className={`w-full grid ${videoUrl && "md:grid-cols-2"} gap-6`}>
            {videoUrl && (
              <div className="w-full bg-main text-sm text-subMain py-4 border-border border rounded flex-colo">
                Video Uploaded!!!
              </div>
            )}
            <Uploder setImageUrl={setVideoUrl} />
          </div>
        </div>
        {/* CASTS */}
        <div className="w-full grid lg:grid-cols-2 gap-6 items-start ">
          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-4 bg-main border border-subMain border-dashed text-white rounded"
          >
            Add Cast
          </button>
          <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-4 grid-cols-2 gap-4">
            {casts?.length > 0 &&
              casts.map((user, i) => (
                <div
                  key={user.id}
                  className="p-2 italic text-xs text-text rounded flex-colo bg-main border border-border"
                >
                  <img
                    src={`${user.image ? user.image : ""}`}
                    alt={user.name}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <p>{user.name}</p>
                  <div className="flex-rows mt-2 w-full gap-2">
                    <button
                      type="button"
                      onClick={() => deleteCast(user.id)}
                      className="w-6 h-6 flex-colo bg-dry border border-border text-subMain rounded"
                    >
                      <MdDelete />
                    </button>
                    <button
                      onClick={() => {
                        setCast(user);
                        setModalOpen(true);
                      }}
                      className="w-6 h-6 flex-colo bg-dry border border-border text-green-600 rounded"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* SUBMIT */}
        <button
          onClick={handleSubmit(onSubmit)}
          className="bg-subMain w-full flex-rows gap-6 font-medium text-white py-4 rounded"
        >
          {isLoading ? (
            "Please Wait..."
          ) : (
            <>
              <ImUpload /> Publish Video
            </>
          )}
        </button>
      </div>
    </SideBar>
  );
}

export default AddMovie;
