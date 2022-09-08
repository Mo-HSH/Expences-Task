class AddAccountToExpenses < ActiveRecord::Migration[6.0]
  def change
    add_reference :expenses, :account, index: true, null: false
  end
end
