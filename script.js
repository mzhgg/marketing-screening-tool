// DOM元素获取
document.addEventListener('DOMContentLoaded', function() {
    // 文件上传相关
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const removeFile = document.getElementById('removeFile');

    // 参数调整相关
    const adjCoupon = document.getElementById('adjCoupon');
    const adjThreshold = document.getElementById('adjThreshold');
    const adjValidity = document.getElementById('adjValidity');

    // 显示值相关元素
    const couponAmount = document.getElementById('couponAmount');
    const threshold = document.getElementById('threshold');
    const validity = document.getElementById('validity');
    const estRedemption = document.getElementById('estRedemption');
    const estCost = document.getElementById('estCost');
    const estGMV = document.getElementById('estGMV');
    const estROI = document.getElementById('estROI');
    const crowdSize = document.getElementById('crowdSize');
    const crowdCountDisplay = document.getElementById('crowdCountDisplay');
    const predRedemption = document.getElementById('predRedemption');

    // 人群名称
    const crowdNameInput = document.getElementById('crowdName');

    // 基础数据
    let baseData = {
        crowdSize: 18000, // 人群规模
        avgOrderPrice: 65, // 平均客单价
        baseRedemption: 35.2, // 基础核销率
        avgThreshold: 60 // 平均门槛
    };

    // 6.2 文件上传功能
    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#FFD100';
        uploadArea.style.background = '#fff9e6';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = '#F5F5F5';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = '#F5F5F5';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.name.endsWith('.csv')) {
            alert('请上传CSV格式文件');
            return;
        }

        // 显示文件信息
        uploadArea.style.display = 'none';
        fileInfo.style.display = 'flex';
        fileName.textContent = file.name;

        // 模拟上传处理
        simulateUpload(file);
    }

    function simulateUpload(file) {
        // 模拟处理文件，增加人群规模
        setTimeout(() => {
            const additionalUsers = Math.floor(Math.random() * 5000) + 1000;
            baseData.crowdSize += additionalUsers;
            updateAllCalculations();
            updateTimeDisplay();
            alert(`成功导入 ${additionalUsers} 个用户ID`);
        }, 1000);
    }

    removeFile.addEventListener('click', () => {
        uploadArea.style.display = 'block';
        fileInfo.style.display = 'none';
        fileInput.value = '';
        
        // 重置人群规模
        baseData.crowdSize = 18000;
        updateAllCalculations();
    });

    // 6.3 参数调整功能
    adjCoupon.addEventListener('input', handleParameterChange);
    adjThreshold.addEventListener('input', handleParameterChange);
    adjValidity.addEventListener('input', handleParameterChange);

    // 参数范围限制
    adjCoupon.addEventListener('change', () => {
        let val = parseInt(adjCoupon.value);
        if (val < 5) val = 5;
        if (val > 10) val = 10;
        adjCoupon.value = val;
        handleParameterChange();
    });

    adjThreshold.addEventListener('change', () => {
        let val = parseInt(adjThreshold.value);
        if (val < 50) val = 50;
        if (val > 70) val = 70;
        adjThreshold.value = val;
        handleParameterChange();
    });

    adjValidity.addEventListener('change', () => {
        let val = parseInt(adjValidity.value);
        if (val < 3) val = 3;
        if (val > 7) val = 7;
        adjValidity.value = val;
        handleParameterChange();
    });

    function handleParameterChange() {
        const coupon = parseInt(adjCoupon.value) || 8;
        const thresholdVal = parseInt(adjThreshold.value) || 60;
        const days = parseInt(adjValidity.value) || 5;

        // 更新显示值
        couponAmount.textContent = `${coupon}元`;
        threshold.textContent = `${thresholdVal}元`;
        validity.textContent = `${days}天`;

        // 计算预计核销率（基于参数调整的简单模型）
        const redemptionChange = calculateRedemptionChange(coupon, thresholdVal, days);
        const newRedemption = Math.min(50, Math.max(10, baseData.baseRedemption + redemptionChange));
        
        estRedemption.textContent = `${newRedemption.toFixed(1)}%`;

        // 计算成本效益
        calculateBenefit(coupon, newRedemption, thresholdVal);
    }

    function calculateRedemptionChange(coupon, thresholdVal, days) {
        // 简单的核销率预测模型
        let change = 0;
        
        // 券面额影响：每增加1元，核销率增加约2%
        change += (coupon - 8) * 2;
        
        // 门槛影响：门槛越高，核销率越低
        change -= (thresholdVal - 60) * 0.3;
        
        // 有效期影响：5天为最佳，过长或过短都会降低
        if (days < 5) change -= (5 - days) * 1;
        if (days > 5) change -= (days - 5) * 0.5;
        
        return change;
    }

    function calculateBenefit(coupon, redemptionRate, thresholdVal) {
        const peopleCount = baseData.crowdSize;
        const estimatedUsers = Math.floor(peopleCount * redemptionRate / 100);
        
        // 预计补贴支出 = 券面额 × 预计核销人数
        const cost = (coupon * estimatedUsers) / 10000;
        estCost.textContent = `${cost.toFixed(1)}万元`;
        
        // 预计撬动GMV = 门槛 × 预计核销人数 × 转化系数
        const gmv = (thresholdVal * estimatedUsers * 1.5) / 10000;
        estGMV.textContent = `${gmv.toFixed(0)}万元`;
        
        // 预计ROI = GMV / 成本
        const roi = gmv / cost;
        estROI.textContent = roi.toFixed(1);
    }

    // 6.2 人群筛选更新
    function updateAllCalculations() {
        const sizeInWan = (baseData.crowdSize / 10000).toFixed(1);
        crowdSize.textContent = `${sizeInWan}万人`;
        crowdCountDisplay.textContent = `${sizeInWan}万人`;
        
        // 重新计算所有数据
        handleParameterChange();
    }

    // 更新时间显示
    function updateTimeDisplay() {
        const updateTime = document.getElementById('updateTime');
        updateTime.textContent = '刚刚更新';
    }

    // 6.4 风险详情查看
    const viewRiskDetail = document.getElementById('viewRiskDetail');
    viewRiskDetail.addEventListener('click', () => {
        alert('风险用户明细：\n高风险用户：180人\n- 疑似刷单：85人\n- 恶意退款：65人\n- 异常设备：30人\n\n中风险用户：360人\n- 频繁退换：145人\n- 异常地址：120人\n- 低活跃度：95人');
    });

    // 人群名称编辑
    crowdNameInput.addEventListener('focus', function() {
        this.select();
    });

    // 复选框交互效果
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // 当选择自定义选项时，显示输入框
            if (checkbox.value === 'custom') {
                const parent = checkbox.closest('.checkbox-item');
                const inputs = parent.querySelectorAll('.custom-range');
                inputs.forEach(input => {
                    input.style.display = checkbox.checked ? 'inline-block' : 'none';
                });
            }
            
            // 筛选条件变化时更新人群规模（模拟）
            simulateFilterChange();
        });
    });

    function simulateFilterChange() {
        // 模拟筛选条件变化后的人群规模调整
        const checkedCount = document.querySelectorAll('.checkbox-item input:checked').length;
        const randomFactor = 0.8 + Math.random() * 0.4;
        const newSize = Math.floor(18000 * checkedCount * randomFactor / 10);
        baseData.crowdSize = Math.max(5000, newSize);
        
        updateAllCalculations();
        updateTimeDisplay();
    }

    // 退出按钮
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            alert('已退出登录');
            // 实际应用中这里会跳转到登录页
        }
    });

    // 初始化
    handleParameterChange();

    // 柱状图交互效果
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'scaleY(1.05)';
        });
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'scaleY(1)';
        });
    });

    // 用户信息下拉交互
    const userInfo = document.querySelector('.user-info');
    let dropdownVisible = false;
    
    userInfo.addEventListener('click', () => {
        if (!dropdownVisible) {
            const dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown';
            dropdown.innerHTML = `
                <div class="dropdown-item"><i class="fas fa-user"></i> 个人资料</div>
                <div class="dropdown-item"><i class="fas fa-cog"></i> 设置</div>
                <div class="dropdown-item"><i class="fas fa-history"></i> 操作历史</div>
            `;
            dropdown.style.cssText = `
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                padding: 8px 0;
                min-width: 150px;
                z-index: 1000;
                animation: fadeIn 0.2s ease;
            `;
            userInfo.style.position = 'relative';
            userInfo.appendChild(dropdown);
            
            // 点击外部关闭
            setTimeout(() => {
                document.addEventListener('click', closeDropdown);
            }, 100);
            
            dropdownVisible = true;
        }
    });

    function closeDropdown(e) {
        if (!e.target.closest('.user-info')) {
            const dropdown = document.querySelector('.user-dropdown');
            if (dropdown) {
                dropdown.remove();
            }
            document.removeEventListener('click', closeDropdown);
            dropdownVisible = false;
        }
    }
});