import axios from "axios";
import {
    DEFAULT_PAGE,
    DEFAULT_PER_PAGE,
    PRODUCTS_ENDPOINT,
    PRODUCTS_RATING_DESC,
    PRODUCTS_PRICE_ASC,
    PRODUCTS_PRICE_DESC
} from "../configs/constants";
import Order from "../components/Order";
import { useState } from "react";



const SeachProducts = async ({
    searchKey,
    page = DEFAULT_PAGE,
    perPage = DEFAULT_PER_PAGE
}: {
    searchKey: string,
    page: number,
    perPage: number
}) => {
    const paginationParams = `&limit=${perPage}&skip=${(page - 1) * perPage}`;

    //Rating
    // const response = await axios.get(`https://dummyjson.com/products/search?q=${searchKey}&sortBy=rating&order=desc${paginationParams}`);

    //Expensive First
    // const response = await axios.get(`https://dummyjson.com/products/search?q=${searchKey}&sortBy=price&order=desc${paginationParams}`);

    //Cheapest First
    // const response = await axios.get(`https://dummyjson.com/products/search?q=${searchKey}&sortBy=price&order=asc${paginationParams}`);

    //Discount
    // const response = await axios.get(`https://dummyjson.com/products/search?q=${searchKey}&sortBy=discountPercentage&order=desc${paginationParams}`);
    
    //Default
     const response = await axios.get(`${PRODUCTS_ENDPOINT}/search?q=${searchKey}${paginationParams}`);
    const { products, skip, total } = response.data;

    return { products, perPage, total, page: skip / perPage + 1, lastPage: Math.ceil(total / perPage) };
}

export { SeachProducts };