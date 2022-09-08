class CreateAccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :accounts do |t|
      t.string :name, null: false
      t.string :number, null: false
      t.decimal :balance, precision: 20, scale: 4, default: '0.0'

      t.timestamps
    end
  end
end
