class CreateComments < ActiveRecord::Migration[6.0]
  def change
    create_table :comments do |t|
      t.string :content
      t.string :username
      t.integer :state_id

      t.timestamps
    end
  end
end
