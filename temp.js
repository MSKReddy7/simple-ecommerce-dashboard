const handle_add_edit = () => 
{
    if (!formData.name || !formData.quality || !formData.quantity) 
        return;

    let updatedFoods = [...foods];

    if (editFoodId !== null) 
    {
        // Edit mode: update the selected item
        updatedFoods = updatedFoods.map(food => food.id === editFoodId ? { ...food, ...formData, quantity: Math.max(0, Number(formData.quantity))} : food );
        setEditFoodId(null);
    } 
    else 
    {
        // Add mode: merge duplicates if same name & quality
        const duplicates = updatedFoods.filter(food => food.name === formData.name && food.quality === formData.quality);

        const totalQuantity =
        duplicates.reduce((sum, item) => sum + Number(item.quantity), 0) +
        Number(formData.quantity);

        // Remove all duplicates
        updatedFoods = updatedFoods.filter(
        food => !(food.name === formData.name && food.quality === formData.quality)
        );

        // Add the merged/updated item
        updatedFoods.push({
        id: crypto.randomUUID(),
        name: formData.name,
        quality: formData.quality,
        quantity: Math.max(0, totalQuantity),
        });


    }

    setFoods(updatedFoods);
    setFormData({ name: "", quality: "", quantity: "" });
};