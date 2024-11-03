import { useEffect, useState } from "react";

function NewAuctionPage() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemCondition, setItemCondition] = useState("");
  const [tag, setTag] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [minStartDate, setMinStartDate] = useState("");
  const [minEndDate, setMinEndDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const formattedNow = now.toISOString().slice(0, 16);
    setMinStartDate(formattedNow);
  }, []);

  useEffect(() => {
    if (startDate) {
      setMinEndDate(startDate);
    }
  }, [startDate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages((prevImages) => [...prevImages, ...fileArray]);

      const newPreviews = fileArray.map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
        });
      });

      Promise.all(newPreviews).then((results) => {
        setImagePreviews((prevPreviews) => [...prevPreviews, ...results]);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      itemName,
      description,
      price,
      startDate,
      endDate,
      itemCategory,
      itemCondition,
      tag,
      images,
    });
  };

  return (
    <div className="w-full mx-auto bg-white flex justify-center px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="border rounded-3xl w-full max-w-3xl p-6 sm:p-8 m-8 bg-gray-100 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Create new Auction</h1>

        <div className="flex flex-wrap sm:flex-nowrap">
          <div className="w-full sm:w-2/3 sm:pr-4">
            <div className="flex flex-wrap mb-4">
              {/* Item name */}
              <div className="w-full sm:w-1/2 px-2 mb-4 sm:mb-0">
                <label className="block text-gray-700 font-light mb-2" htmlFor="itemName">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item name..."
                  required
                  autoFocus
                />
              </div>

              {/* Item category */}
              <div className="w-full sm:w-1/2 px-2">
                <label className="block text-gray-700 font-light mb-2" htmlFor="itemCategory">Item Category</label>
                <input
                  type="text"
                  id="itemCategory"
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item category..."
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap mb-4">
              {/* Tag */}
              <div className="w-full sm:w-1/2 px-2 mb-4 sm:mb-0">
                <label className="block text-gray-700 font-light mb-2" htmlFor="itemTag">Tag</label>
                <input
                  type="text"
                  id="itemTag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item tag..."
                  required
                />
              </div>

              {/* Item condition */}
              <div className="w-full sm:w-1/2 px-2">
                <label className="block text-gray-700 font-light mb-2" htmlFor="itemCondition">Item Condition</label>
                <input
                  type="text"
                  id="itemCondition"
                  value={itemCondition}
                  onChange={(e) => setItemCondition(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item condition..."
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap mb-4">
              {/* Start date */}
              <div className="w-full sm:w-1/2 px-2 mb-4 sm:mb-0">
                <label className="block text-gray-700 font-light mb-2" htmlFor="startDate">Start date</label>
                <input
                  type="datetime-local"
                  id="startDate"
                  value={startDate}
                  min={minStartDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* End date */}
              <div className="w-full sm:w-1/2 px-2">
                <label className="block text-gray-700 font-light mb-2" htmlFor="endDate">End date</label>
                <input
                  type="datetime-local"
                  id="endDate"
                  value={endDate}
                  min={minEndDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mb-4">
              {/* Description */}
              <div className="w-full px-2">
                <label className="block text-gray-700 font-light mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the item description..."
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mb-4">
              {/* Price */}
              <div className="w-full px-2">
                <label className="block text-gray-700 font-light mb-2" htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the item price..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Image upload */}
          <div className="w-full sm:w-1/3 sm:pl-4 flex flex-col items-center">
            <label className="block text-gray-700 font-light mb-2" htmlFor="image">Upload Images</label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              multiple
              required
              accept="image/*"
            />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {imagePreviews.map((preview, index) => (
                <img key={index} src={preview} alt={`Preview ${index}`} className="h-20 w-20 object-cover rounded" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-full sm:w-1/3 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Auction
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewAuctionPage;
