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
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Create New Auction</h1>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Item Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="itemName">Item Name</label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter item name..."
                required
              />
            </div>

            {/* Item Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="itemCategory">Item Category</label>
              <input
                type="text"
                id="itemCategory"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter item category..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tag */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="itemTag">Tag</label>
              <input
                type="text"
                id="itemTag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter item tag..."
                required
              />
            </div>

            {/* Item Condition */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="itemCondition">Condition</label>
              <input
                type="text"
                id="itemCondition"
                value={itemCondition}
                onChange={(e) => setItemCondition(e.target.value)}
                className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter item condition..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="startDate">Start Date</label>
              <input
                type="datetime-local"
                id="startDate"
                value={startDate}
                min={minStartDate}
                onChange={(e) => setStartDate(e.target.value)}
                 className="w-full bg-black text-white border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="endDate">End Date</label>
              <input
                type="datetime-local"
                id="endDate"
                value={endDate}
                min={minEndDate}
                onChange={(e) => setEndDate(e.target.value)}
                 className="w-full bg-black text-white  border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter the item description..."
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter the item price..."
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="image">Upload Images</label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              multiple
              required
              accept="image/*"
            />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {imagePreviews.map((preview, index) => (
                <img key={index} src={preview} alt={`Preview ${index}`} className="h-24 w-24 object-cover rounded-lg shadow-md" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="w-full sm:w-1/3 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          > 
            Create Auction
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewAuctionPage;