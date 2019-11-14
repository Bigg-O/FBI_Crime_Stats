class AddCommentToStates < ActiveRecord::Migration[6.0]
  def change
    add_column :states, :comment, :string
  end
end
