import { connect } from 'react-redux'

import React, { useEffect, useState, useRef } from 'react';

function Count({ count, user, jia, jian, jiaAsync }) {

    const selectRef = useRef();

    const simpleAdd = () => {
        jia(selectRef.current.value * 1)
    }

    const simpleMinus = () => {

        jian(selectRef.current.value * 1)
    }

    const addIfOdd = () => {
        if (count % 2 !== 0) {
            jia(selectRef.current.value * 1)
        }
    }

    const asyncAdd = () => {
        jiaAsync(selectRef.current.value * 1, 1000)
    }

    return (
        <div>
            <h1>Current Sum is: {count}</h1>
            <select ref={selectRef}>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>&nbsp;

            <button onClick={simpleAdd}>+</button>&nbsp;
            <button onClick={simpleMinus}>-</button>&nbsp;
            <button onClick={addIfOdd}>add if Current sum is Odd</button>&nbsp;
            <button onClick={asyncAdd}>async add</button>

        </div>
    );
};

const mapStateToProps = (state) => ({
    count: state.count
});

function mapDispatchToProps(dispatch) {
    return {
        jia: number => dispatch(
            {
                type: 'INCREMENT',
                data: number * 1
            }
        ),
        jian: number => dispatch(
            {
                type: 'DECREMENT',
                data: number * 1
            }
        ),
        jiaAsync: (number, time) => dispatch(
            (dispatch) => {
                setTimeout(() => {
                    dispatch(
                        {
                            type: 'INCREMENT',
                            data: number * 1
                        }
                    )
                }, time)
            }
        ),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Count)