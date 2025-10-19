import { connectDatabase } from '@/lib/database'
import ShoppingItemModel, {
  IShoppingItem,
  TShoppingItemStatus,
} from '@/models/ShoppingItem'

// Models: Shopping Item
import '@/models/ShoppingItem'
import { FilterQuery } from 'mongoose'

// MARK: Get Shopping List
export const getShoppingList = async (
  userId: string,
  status?: TShoppingItemStatus
) => {
  await connectDatabase()

  const filter: FilterQuery<IShoppingItem> = { userId }
  if (status) filter.status = status

  const shoppingList = await ShoppingItemModel.find(filter)
    .sort({ createdAt: -1 })
    .lean()

  return {
    shoppingList: JSON.parse(JSON.stringify(shoppingList)),
    message: 'Shopping list retrieved successfully',
  }
}

// MARK: Add Shopping Item
export const addShoppingItem = async (
  userId: string,
  data: { name: string; status: TShoppingItemStatus; notes: string }
) => {
  await connectDatabase()

  const { name, status, notes } = data
  if (!name) throw new Error('Missing required fields')

  const shoppingItem = await ShoppingItemModel.create({
    userId,
    name,
    status,
    notes,
  })

  return {
    shoppingItem: JSON.parse(JSON.stringify(shoppingItem)),
    message: 'Shopping item added successfully',
  }
}

// MARK: Update Shopping Item
export const updateShoppingItem = async (
  userId: string,
  data: {
    shoppingItemId: string
    name: string
    status: TShoppingItemStatus
    notes: string
  }
) => {
  await connectDatabase()

  const { shoppingItemId, name, status, notes } = data
  if (!shoppingItemId || !name) throw new Error('Missing required fields')

  const shoppingItem = await ShoppingItemModel.findByIdAndUpdate(
    shoppingItemId,
    { name, status, notes },
    { new: true, runValidators: true }
  )
  if (!shoppingItem) throw new Error('Shopping item not found')

  return {
    shoppingItem: JSON.parse(JSON.stringify(shoppingItem)),
    message: 'Shopping item updated successfully',
  }
}

// MARK: Delete Shopping Item
export const deleteShoppingItem = async (
  userId: string,
  data: { shoppingItemId: string }
) => {
  await connectDatabase()

  const { shoppingItemId } = data
  if (!shoppingItemId) throw new Error('Missing required fields')

  const deletedShoppingItem = await ShoppingItemModel.findByIdAndDelete(
    shoppingItemId,
    { new: true }
  )
  if (!deletedShoppingItem) throw new Error('Shopping item not found')

  return {
    shoppingItem: JSON.parse(JSON.stringify(deletedShoppingItem)),
    message: 'Shopping item deleted successfully',
  }
}
