package com.example.sean_pardy_project_1;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class RecyclerViewAdapter extends RecyclerView.Adapter {

    private final List<String> myData;
    private final List<Integer> myImages;
    private final LayoutInflater myInflater;
    private ItemClickListener myClickListener;

    public RecyclerViewAdapter(MainActivity context, List<String> myData,List<Integer> myImages) {
        this.myData = myData;
        this.myImages = myImages;
        this.myInflater = LayoutInflater.from(context);
    }

    void setClickListener(ItemClickListener itemClickListener){
        this.myClickListener = itemClickListener;
    }

    public interface ItemClickListener{
        void onItemClick(View view, int position);
    }

    @NonNull
    @Override
    public RecyclerViewAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = myInflater.inflate(R.layout.cardrow,parent,false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {

    }

    public void onBindViewHolder(@NonNull RecyclerViewAdapter.ViewHolder holder, int position) {
        String name = myData.get(position);
        Integer img = myImages.get(position);

        holder.myTextView.setText(name);
        holder.myImageView.setImageResource(img);

    }

    @Override
    public int getItemCount() {
        return myData.size();
    }
    String getItem(int id){
        return myData.get(id);
    }

    public class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        TextView myTextView;
        ImageView myImageView;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            myTextView = itemView.findViewById(R.id.textView4);
            myImageView = itemView.findViewById(R.id.imageView4);
            itemView.setOnClickListener(this);
        }
        @Override
        public void onClick(View view) {
            if(myClickListener!= null)myClickListener.onItemClick(view,getAdapterPosition());
        }
    }
}
